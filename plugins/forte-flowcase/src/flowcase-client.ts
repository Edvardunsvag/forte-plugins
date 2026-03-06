// TypeScript interfaces matching Flowcase API responses
export interface FlowcaseUser {
  user_id: string;
  name: string;
  default_cv_id: string | null;
  office_id: string | null;
  office_name: string | null;
}

export interface MultiLang {
  no?: string;
  int?: string;
}

export interface FlowcaseCv {
  _id: string;
  name: string;
  title: MultiLang | null;
  key_qualifications: KeyQualification[];
  technologies: Technology[];
  project_experiences: ProjectExperience[];
  work_experiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  courses: Course[];
  languages: Language[];
  cv_roles: CvRole[];
}

export interface KeyQualification {
  long_description: MultiLang | null;
  tag_line: MultiLang | null;
}

export interface Technology {
  technology_skills: TechnologySkill[];
}

export interface TechnologySkill {
  tags: MultiLang | null;
  total_duration_in_years: number;
}

export interface ProjectExperience {
  customer: MultiLang | null;
  description: MultiLang | null;
  long_description: MultiLang | null;
  customer_value_proposition: MultiLang | null;
  customer_description: MultiLang | null;
  month_from: number | null;
  year_from: number | null;
  month_to: number | null;
  year_to: number | null;
  roles: Role[];
  project_experience_skills: ProjectSkill[];
}

export interface Role {
  name: MultiLang | null;
  long_description: MultiLang | null;
}

export interface ProjectSkill {
  tags: MultiLang | null;
}

export interface WorkExperience {
  employer: MultiLang | null;
  description: MultiLang | null;
  long_description: MultiLang | null;
  month_from: number | null;
  year_from: number | null;
  month_to: number | null;
  year_to: number | null;
}

export interface Education {
  school: MultiLang | null;
  degree: MultiLang | null;
  description: MultiLang | null;
  month_from: number | null;
  year_from: number | null;
  month_to: number | null;
  year_to: number | null;
}

export interface Certification {
  name: MultiLang | null;
  organiser: MultiLang | null;
  long_description: MultiLang | null;
  year: number | null;
  month: number | null;
  year_expire: number | null;
  month_expire: number | null;
}

export interface Course {
  name: MultiLang | null;
  program: MultiLang | null;
  long_description: MultiLang | null;
  year: number | null;
  month: number | null;
}

export interface Language {
  name: MultiLang | null;
  level: MultiLang | null;
}

export interface CvRole {
  name: MultiLang | null;
  long_description: MultiLang | null;
  years_of_experience: number | null;
}

interface FlowcaseCountry {
  _id: string;
  code: string;
  offices: FlowcaseOffice[];
}

interface FlowcaseOffice {
  _id: string;
  name: string;
  country_code: string;
}

// Helper
export function getPreferred(ml: MultiLang | null | undefined): string {
  return ml?.no ?? ml?.int ?? "";
}

// Simple TTL cache
class TtlCache<T> {
  private data: Map<string, { value: T; expires: number }> = new Map();

  get(key: string): T | undefined {
    const entry = this.data.get(key);
    if (!entry || Date.now() > entry.expires) {
      this.data.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.data.set(key, { value, expires: Date.now() + ttlMs });
  }
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface SessionFile {
  cookie: string;
  domain: string;
  savedAt: string;
  expiresAt?: string;
}

export const SESSION_FILE_PATH = `${process.env.HOME}/.claude/flowcase-session.json`;

export class FlowcaseClient {
  private endpoint: string;
  private token: string | null;
  private sessionCookie: string | null = null;
  private userCache = new TtlCache<FlowcaseUser[]>();
  private cvCache = new TtlCache<FlowcaseCv>();

  constructor(endpoint: string, token: string | null) {
    this.endpoint = endpoint.replace(/\/$/, "");
    this.token = token;
    this.loadSessionCookie();
  }

  private loadSessionCookie(): void {
    try {
      const fs = require("fs");
      if (fs.existsSync(SESSION_FILE_PATH)) {
        const data: SessionFile = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf-8"));
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          console.error("Flowcase session cookie expired, falling back to token");
          return;
        }
        this.sessionCookie = data.cookie;
        console.error("Loaded Flowcase session cookie from file");
      }
    } catch {
      // Ignore - will fall back to token
    }
  }

  setSessionCookie(cookie: string): void {
    this.sessionCookie = cookie;
  }

  private getAuthHeaders(): Record<string, string> {
    if (this.sessionCookie) {
      return { Cookie: `cvpartner.session=${this.sessionCookie}` };
    }
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
    }
    throw new Error("No auth available: no session cookie or API token configured");
  }

  private async fetch<T>(path: string): Promise<T> {
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
        return retry.json() as Promise<T>;
      }
      throw new Error(`Flowcase API ${res.status}: ${res.statusText} (${path})`);
    }
    return res.json() as Promise<T>;
  }

  async getOfficeIds(countryCode: string): Promise<string[]> {
    const countries = await this.fetch<FlowcaseCountry[]>("v1/countries");
    const country = countries.find(
      (c) => c.code.toLowerCase() === countryCode.toLowerCase()
    );
    if (!country) return [];
    return country.offices.map((o) => o._id);
  }

  async listConsultants(countryCode: string = "no"): Promise<FlowcaseUser[]> {
    const cacheKey = `users:${countryCode}`;
    const cached = this.userCache.get(cacheKey);
    if (cached) return cached;

    const officeIds = await this.getOfficeIds(countryCode);
    if (officeIds.length === 0) return [];

    const allUsers: FlowcaseUser[] = [];
    const pageSize = 50;
    let offset = 0;
    const officeFilter = officeIds.map((id) => `&office_ids[]=${id}`).join("");

    while (true) {
      const url = `v2/users/search?size=${pageSize}&from=${offset}&deactivated=false${officeFilter}`;
      const page = await this.fetch<FlowcaseUser[]>(url);
      if (!page || page.length === 0) break;

      allUsers.push(...page.filter((u) => u.default_cv_id !== null));
      offset += pageSize;
      if (page.length < pageSize) break;

      // Rate limit courtesy
      await new Promise((r) => setTimeout(r, 100));
    }

    this.userCache.set(cacheKey, allUsers, CACHE_TTL);
    return allUsers;
  }

  async getCv(userId: string, cvId: string): Promise<FlowcaseCv> {
    const cacheKey = `cv:${userId}:${cvId}`;
    const cached = this.cvCache.get(cacheKey);
    if (cached) return cached;

    const cv = await this.fetch<FlowcaseCv>(`v3/cvs/${userId}/${cvId}`);
    this.cvCache.set(cacheKey, cv, CACHE_TTL);
    return cv;
  }
}
