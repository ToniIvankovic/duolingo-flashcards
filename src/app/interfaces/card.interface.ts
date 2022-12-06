import { ITreeSkill } from './api-data.interface';

export interface ISessionResults{
    correct: number;
    total: number;
    incorrect: ICard[];
}

export interface ISession {
    cards: ICard[];
}

export interface ICard {
    word: IWord;
    seen?: boolean;
    correct?: boolean;
}

export interface IWord {
    word: string;
    translations: string[];
    skill: ITreeSkill;
}

export interface IRawWord {
    word: string;
    skill: ITreeSkill;
}
