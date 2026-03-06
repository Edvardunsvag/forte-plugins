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
export const SESSION_FILE_PATH = `${process.env.HOME}/.claude/flowcase-session.json`;
export class FlowcaseClient {
    endpoint;
    token;
    sessionCookie = null;
    userCache = new TtlCache();
    cvCache = new TtlCache();
    constructor(endpoint, token) {
        this.endpoint = endpoint.replace(/\/$/, "");
        this.token = token;
        this.loadSessionCookie();
    }
    loadSessionCookie() {
        try {
            const fs = require("fs");
            if (fs.existsSync(SESSION_FILE_PATH)) {
                const data = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf-8"));
                if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
                    console.error("Flowcase session cookie expired, falling back to token");
                    return;
                }
                this.sessionCookie = data.cookie;
                console.error("Loaded Flowcase session cookie from file");
            }
        }
        catch {
            // Ignore - will fall back to token
        }
    }
    setSessionCookie(cookie) {
        this.sessionCookie = cookie;
    }
    getAuthHeaders() {
        if (this.sessionCookie) {
            return { Cookie: `cvpartner.session=${this.sessionCookie}` };
        }
        if (this.token) {
            return { Authorization: `Bearer ${this.token}` };
        }
        throw new Error("No auth available: no session cookie or API token configured");
    }
    async fetch(path) {
        const res = await fetch(`${this.endpoint}/${path}`, {
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            if (this.sessionCookie && this.token && res.status === 401) {
                console.error("Session cookie auth failed, falling back to Bearer token");
                this.sessionCookie = null;
                const retry = await fetch(`${this.endpoint}/${path}`, {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                if (!retry.ok) {
                    throw new Error(`Flowcase API ${retry.status}: ${retry.statusText} (${path})`);
                }
                return retry.json();
            }
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
