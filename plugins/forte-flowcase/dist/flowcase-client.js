// Helper
export function getPreferred(ml) {
    return ml?.no ?? ml?.int ?? "";
}
// Simple TTL cache
class TtlCache {
    data = new Map();
    get(key) {
        const entry = this.data.get(key);
        if (!entry || Date.now() > entry.expires) {
            this.data.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value, ttlMs) {
        this.data.set(key, { value, expires: Date.now() + ttlMs });
    }
}
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export class FlowcaseClient {
    endpoint;
    token;
    userCache = new TtlCache();
    cvCache = new TtlCache();
    constructor(endpoint, token) {
        this.endpoint = endpoint.replace(/\/$/, "");
        this.token = token;
    }
    async fetch(path) {
        const res = await fetch(`${this.endpoint}/${path}`, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
        if (!res.ok) {
            throw new Error(`Flowcase API ${res.status}: ${res.statusText} (${path})`);
        }
        return res.json();
    }
    async getOfficeIds(countryCode) {
        const countries = await this.fetch("v1/countries");
        const country = countries.find((c) => c.code.toLowerCase() === countryCode.toLowerCase());
        if (!country)
            return [];
        return country.offices.map((o) => o._id);
    }
    async listConsultants(countryCode = "no") {
        const cacheKey = `users:${countryCode}`;
        const cached = this.userCache.get(cacheKey);
        if (cached)
            return cached;
        const officeIds = await this.getOfficeIds(countryCode);
        if (officeIds.length === 0)
            return [];
        const allUsers = [];
        const pageSize = 50;
        let offset = 0;
        const officeFilter = officeIds.map((id) => `&office_ids[]=${id}`).join("");
        while (true) {
            const url = `v2/users/search?size=${pageSize}&from=${offset}&deactivated=false${officeFilter}`;
            const page = await this.fetch(url);
            if (!page || page.length === 0)
                break;
            allUsers.push(...page.filter((u) => u.default_cv_id !== null));
            offset += pageSize;
            if (page.length < pageSize)
                break;
            // Rate limit courtesy
            await new Promise((r) => setTimeout(r, 100));
        }
        this.userCache.set(cacheKey, allUsers, CACHE_TTL);
        return allUsers;
    }
    async getCv(userId, cvId) {
        const cacheKey = `cv:${userId}:${cvId}`;
        const cached = this.cvCache.get(cacheKey);
        if (cached)
            return cached;
        const cv = await this.fetch(`v3/cvs/${userId}/${cvId}`);
        this.cvCache.set(cacheKey, cv, CACHE_TTL);
        return cv;
    }
}
