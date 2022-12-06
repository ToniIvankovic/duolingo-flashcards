export interface IPathApiData {
    courses: IPathCourse[];
    currentCourse: IPathCourseExtended;
}

export interface IPathCourse {
    learningLanguage: string;
    title: string;
}

export interface IPathCourseExtended {
    learningLanguage: string;
    title: string;
    fromLanguage: string;
    path: IPathUnit[];
}

export interface IPathUnit {
    unitIndex: number;
    teachingObjective: string;
    levels: IPathLevel[];
}

export interface IPathLevel {
    id: string;
    state: string;
    type: string;
    subtype ?: string;
    pathLevelMetadata: IPathLevelMetadata;
}

export interface IPathLevelMetadata {
    skillId ?: string;
    skillIds ?: string[];
}


export interface ITreeApiData {
    languages: ITreeLanguage[];
    language_data: {
        [key: string]: ITreeLanguageData;
    };
}

export interface ITreeLanguage {
    current_learning: boolean;
    language: string;
    language_string: string;
    learning: boolean;
}

export interface ITreeLanguageData {
    language_string: string;
    skills: ITreeSkill[];
}

export interface ITreeSkill {
    dependencies: string[];
    dependencies_name: string[];
    name: string;
    title: string;
    words: string[];
    known_lexemes: string[];
    learned: boolean;
    id: string;
}
