import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';
import { GameMode } from '../enums/game-modes.enum';
import { ICard, IRawWord, ISession } from '../interfaces/card.interface';
import { Card } from '../models/card.model';
import { LanguageDataService } from './language-data.service';

@Injectable({
    providedIn: 'root',
})
export class CardsGameService {
    constructor(private readonly languageDataService: LanguageDataService) {}

    private session?: ISession;
    public prepareSession(
        mode: GameMode,
        amount: number,
        prefferNewer?: boolean,
        lesson?: string
    ): Observable<void> {
        let words$: Observable<IRawWord[]>;
        if (mode == GameMode.PRACTICE_ALL) {
            words$ = this.languageDataService.pickPracticeAllWords(
                prefferNewer || false,
                amount
            );
        } else {
            words$ = EMPTY;
        }
        return words$.pipe(
            switchMap((words) =>
                this.languageDataService.findTranslations(words)
            ),
            map((translatedWords) => {
                let cards: ICard[] = translatedWords.map((word) => {
                    return new Card({ word });
                });
                this.session = { cards };
                console.log(this.session);
            })
        );
    }

    public nextCard(): ICard | null {
        if (!this.session) {
            return null;
        }
        let remainingCards = this.session.cards.filter(card => !card.seen);
        if(remainingCards.length == 0){
            return null;
        }
        remainingCards[0].seen = true;
        return remainingCards[0];
    }
}
