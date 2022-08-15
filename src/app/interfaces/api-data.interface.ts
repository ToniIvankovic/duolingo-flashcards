export interface IApiData {
    languages: ILanguage[];
    language_data: {
        [key: string]: ILanguageData;
    };
}

export interface ILanguage {
    current_learning: boolean;
    language: string;
    language_string: string;
    learning: boolean;
}

export interface ILanguageData {
    language_string: string;
    skills: ISkill[];
}

export interface ISkill {
    dependencies: string[];
    dependencies_name: string[];
    name: string;
    title: string;
    words: string[];
    known_lexemes: string[];
    learned: boolean;
}
