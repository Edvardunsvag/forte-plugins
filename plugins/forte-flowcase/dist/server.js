import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { FlowcaseClient, getPreferred, } from "./flowcase-client.js";
// Validate env vars
const endpoint = process.env.FLOWCASE_ENDPOINT;
const token = process.env.FLOWCASE_TOKEN;
if (!endpoint || !token) {
    console.error("ERROR: FLOWCASE_ENDPOINT and FLOWCASE_TOKEN environment variables are required.");
    process.exit(1);
}
const client = new FlowcaseClient(endpoint, token);
const server = new McpServer({
    name: "forte-flowcase",
    version: "1.0.0",
});
// --- Tool 1: List all consultants ---
server.tool("flowcase_list_consultants", "List all consultants from Flowcase with name, title, office, and CV ID", { countryCode: z.string().optional().default("no").describe("Country code to filter by (default: no)") }, async ({ countryCode }) => {
    const users = await client.listConsultants(countryCode);
    const summary = users.map((u) => ({
        userId: u.user_id,
        name: u.name,
        defaultCvId: u.default_cv_id,
        office: u.office_name,
    }));
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(summary, null, 2),
            },
        ],
    };
});
// --- Helper: format CV for output ---
function formatCv(cv) {
    const skills = (cv.technologies ?? []).flatMap((t) => (t.technology_skills ?? []).map((s) => ({
        name: getPreferred(s.tags),
        years: s.total_duration_in_years,
    })));
    const projects = (cv.project_experiences ?? []).map((p) => ({
        customer: getPreferred(p.customer),
        description: getPreferred(p.description),
        longDescription: getPreferred(p.long_description),
        dateFrom: p.year_from ? `${p.month_from ?? "?"}/${p.year_from}` : null,
        dateTo: p.year_to ? `${p.month_to ?? "?"}/${p.year_to}` : "ongoing",
        roles: (p.roles ?? []).map((r) => getPreferred(r.name)),
        skills: (p.project_experience_skills ?? []).map((s) => getPreferred(s.tags)),
    }));
    const qualifications = (cv.key_qualifications ?? []).map((kq) => getPreferred(kq.long_description) || getPreferred(kq.tag_line));
    const workExperiences = (cv.work_experiences ?? []).map((w) => ({
        employer: getPreferred(w.employer),
        description: getPreferred(w.description),
        longDescription: getPreferred(w.long_description),
        dateFrom: w.year_from ? `${w.month_from ?? "?"}/${w.year_from}` : null,
        dateTo: w.year_to ? `${w.month_to ?? "?"}/${w.year_to}` : "ongoing",
    }));
    const educations = (cv.educations ?? []).map((e) => ({
        school: getPreferred(e.school),
        degree: getPreferred(e.degree),
        description: getPreferred(e.description),
        dateFrom: e.year_from ? `${e.month_from ?? "?"}/${e.year_from}` : null,
        dateTo: e.year_to ? `${e.month_to ?? "?"}/${e.year_to}` : null,
    }));
    const certifications = (cv.certifications ?? []).map((c) => ({
        name: getPreferred(c.name),
        organiser: getPreferred(c.organiser),
        date: c.year ? `${c.month ?? "?"}/${c.year}` : null,
        expires: c.year_expire ? `${c.month_expire ?? "?"}/${c.year_expire}` : null,
    }));
    const courses = (cv.courses ?? []).map((c) => ({
        name: getPreferred(c.name),
        program: getPreferred(c.program),
        date: c.year ? `${c.month ?? "?"}/${c.year}` : null,
    }));
    const languages = (cv.languages ?? []).map((l) => ({
        name: getPreferred(l.name),
        level: getPreferred(l.level),
    }));
    const roles = (cv.cv_roles ?? []).map((r) => ({
        name: getPreferred(r.name),
        description: getPreferred(r.long_description),
        yearsOfExperience: r.years_of_experience,
    }));
    return JSON.stringify({
        title: getPreferred(cv.title),
        keyQualifications: qualifications,
        skills,
        projects,
        workExperiences,
        educations,
        certifications,
        courses,
        languages,
        roles,
    }, null, 2);
}
// --- Tool 2: Get full CV ---
server.tool("flowcase_get_cv", "Get a consultant's full CV from Flowcase including title, qualifications, skills (with years), and all projects", {
    userId: z.string().describe("Flowcase user ID"),
    cvId: z.string().describe("CV ID (use default_cv_id from list_consultants)"),
}, async ({ userId, cvId }) => {
    const cv = await client.getCv(userId, cvId);
    return { content: [{ type: "text", text: formatCv(cv) }] };
});
// --- Tool 3: Get projects only ---
server.tool("flowcase_get_projects", "Get only the project experiences for a consultant (lighter than full CV)", {
    userId: z.string().describe("Flowcase user ID"),
    cvId: z.string().describe("CV ID (use default_cv_id from list_consultants)"),
}, async ({ userId, cvId }) => {
    const cv = await client.getCv(userId, cvId);
    const projects = (cv.project_experiences ?? []).map((p) => ({
        customer: getPreferred(p.customer),
        description: getPreferred(p.description),
        longDescription: getPreferred(p.long_description),
        customerValueProposition: getPreferred(p.customer_value_proposition),
        dateFrom: p.year_from ? `${p.month_from ?? "?"}/${p.year_from}` : null,
        dateTo: p.year_to ? `${p.month_to ?? "?"}/${p.year_to}` : "ongoing",
        roles: (p.roles ?? []).map((r) => ({
            name: getPreferred(r.name),
            description: getPreferred(r.long_description),
        })),
        skills: (p.project_experience_skills ?? []).map((s) => getPreferred(s.tags)),
    }));
    return {
        content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
    };
});
// --- Tool 4: Search by skill ---
server.tool("flowcase_search_by_skill", "Find consultants who have a specific skill in their Flowcase CV. Fetches all CVs and filters (may be slow on first call).", {
    skill: z.string().describe("Skill name to search for (case-insensitive partial match)"),
    countryCode: z.string().optional().default("no").describe("Country code (default: no)"),
}, async ({ skill, countryCode }) => {
    const users = await client.listConsultants(countryCode);
    const matches = [];
    const skillLower = skill.toLowerCase();
    for (const user of users) {
        if (!user.default_cv_id)
            continue;
        try {
            const cv = await client.getCv(user.user_id, user.default_cv_id);
            const matchedSkills = (cv.technologies ?? []).flatMap((t) => (t.technology_skills ?? [])
                .filter((s) => getPreferred(s.tags).toLowerCase().includes(skillLower))
                .map((s) => ({
                name: getPreferred(s.tags),
                years: s.total_duration_in_years,
            })));
            if (matchedSkills.length > 0) {
                matches.push({
                    name: user.name,
                    userId: user.user_id,
                    office: user.office_name,
                    matchedSkills,
                });
            }
        }
        catch {
            // Skip consultants whose CV can't be fetched
        }
    }
    return {
        content: [
            {
                type: "text",
                text: matches.length > 0
                    ? JSON.stringify(matches, null, 2)
                    : `No consultants found with skill matching "${skill}"`,
            },
        ],
    };
});
// --- Tool 5: Search across skills, projects, and customers ---
server.tool("flowcase_search", "Search for consultants by keyword across skills, project customers, project descriptions, and roles. Case-insensitive partial match.", {
    query: z.string().describe("Search keyword (case-insensitive partial match across skills, customers, project descriptions, roles)"),
    countryCode: z.string().optional().default("no").describe("Country code (default: no)"),
}, async ({ query, countryCode }) => {
    const users = await client.listConsultants(countryCode);
    const queryLower = query.toLowerCase();
    const matches = [];
    for (const user of users) {
        if (!user.default_cv_id)
            continue;
        try {
            const cv = await client.getCv(user.user_id, user.default_cv_id);
            // Search skills
            const matchedSkills = (cv.technologies ?? []).flatMap((t) => (t.technology_skills ?? [])
                .filter((s) => getPreferred(s.tags).toLowerCase().includes(queryLower))
                .map((s) => ({
                name: getPreferred(s.tags),
                years: s.total_duration_in_years,
            })));
            // Search projects (customer, description, long_description, roles)
            const matchedProjects = (cv.project_experiences ?? [])
                .map((p) => {
                const customer = getPreferred(p.customer);
                const description = getPreferred(p.description);
                const longDesc = getPreferred(p.long_description);
                const roleNames = (p.roles ?? []).map((r) => getPreferred(r.name)).join(" ");
                const matchedIn = [];
                if (customer.toLowerCase().includes(queryLower))
                    matchedIn.push("customer");
                if (description.toLowerCase().includes(queryLower))
                    matchedIn.push("title");
                if (longDesc.toLowerCase().includes(queryLower))
                    matchedIn.push("description");
                if (roleNames.toLowerCase().includes(queryLower))
                    matchedIn.push("role");
                if (matchedIn.length === 0)
                    return null;
                return {
                    customer,
                    description,
                    dateFrom: p.year_from ? `${p.month_from ?? "?"}/${p.year_from}` : null,
                    dateTo: p.year_to ? `${p.month_to ?? "?"}/${p.year_to}` : "ongoing",
                    matchedIn,
                };
            })
                .filter((p) => p !== null);
            if (matchedSkills.length > 0 || matchedProjects.length > 0) {
                matches.push({
                    name: user.name,
                    userId: user.user_id,
                    office: user.office_name,
                    matches: {
                        skills: matchedSkills,
                        projects: matchedProjects,
                    },
                });
            }
        }
        catch {
            // Skip consultants whose CV can't be fetched
        }
    }
    return {
        content: [
            {
                type: "text",
                text: matches.length > 0
                    ? JSON.stringify(matches, null, 2)
                    : `No consultants found matching "${query}"`,
            },
        ],
    };
});
// --- Start server ---
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Forte Flowcase MCP server running");
