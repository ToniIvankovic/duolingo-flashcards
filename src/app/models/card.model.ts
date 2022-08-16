import { ICard, IWord } from "../interfaces/card.interface";

export class Card{
    public word: IWord;
    public seen: boolean;
    public correct?: boolean;
    constructor(card : ICard){
        this.word = card.word;
        this.seen = false;
    }
}