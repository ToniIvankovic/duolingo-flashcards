import { ISkill } from './api-data.interface';

export interface ISession {
    cards: ICard[];
}

export interface ICard {
    word: IWord;
    seen: boolean;
    correct?: boolean;
}

export interface IWord {
    word: string;
    translations: string[];
    skill: ISkill;
}

export interface IRawWord {
    word: string;
    skill: ISkill;
}
