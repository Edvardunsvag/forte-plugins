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
export declare function getPreferred(ml: MultiLang | null | undefined): string;
export declare class FlowcaseClient {
    private endpoint;
    private token;
    private userCache;
    private cvCache;
    constructor(endpoint: string, token: string);
    private fetch;
    getOfficeIds(countryCode: string): Promise<string[]>;
    listConsultants(countryCode?: string): Promise<FlowcaseUser[]>;
    getCv(userId: string, cvId: string): Promise<FlowcaseCv>;
}
