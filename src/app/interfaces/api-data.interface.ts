export interface IApiData {
    languages: ILanguage[];
    language_data: {
        [key: string]: ILanguageData;
    };
}

interface ILanguage {
    current_learning: boolean;
    language: string;
    language_string: string;
    learning: boolean;
}

export interface ILanguageData {
    language_string: string;
    skills: Skill[];
}

interface Skill {
    dependencies: string[];
    dependencies_name: string[];
    name: string;
    title: string;
    words: string[];
    known_lexemes: string[];
    learned: boolean;
}
