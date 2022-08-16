import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';
import { GameMode } from '../enums/game-modes.enum';
import { IRawWord, ISession } from '../interfaces/card.interface';
import { LanguageDataService } from './language-data.service';

@Injectable({
    providedIn: 'root',
})
export class CardsGameService {
    constructor(private readonly languageDataService: LanguageDataService) {}

    private session?: ISession;
    public startSession(
        mode: GameMode,
        amount: number,
        prefferNewer?: boolean,
        lesson?: string
    ): void {
        let words$: Observable<IRawWord[]>;
        if (mode == GameMode.PRACTICE_ALL) {
            words$ = this.languageDataService.pickPracticeAllWords(
                prefferNewer || false,
                amount
            );
        } else {
            words$ = EMPTY;
        }
        words$
            .pipe(
                switchMap((words) =>
                    this.languageDataService.findTranslations(words)
                )
            )
            .subscribe(translatedWords => {
                console.log(translatedWords);
            });
    }
}
