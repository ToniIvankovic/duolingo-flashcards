import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { GameMode } from '../enums/game-modes.enum';
import { ISkill } from '../interfaces/api-data.interface';
import {
    ICard,
    IRawWord,
    ISession,
    ISessionResults,
} from '../interfaces/card.interface';
import { Card } from '../models/card.model';
import { LanguageDataService } from './language-data.service';

@Injectable({
    providedIn: 'root',
})
export class CardsGameService {
    constructor(private readonly languageDataService: LanguageDataService) {}

    private session?: ISession;
    private session$?: Observable<ISession>;

    public existingSession(): Observable<ISession> | undefined {
        if (this.session) {
            return of(this.session);
        } else {
            return this.session$;
        }
    }

    public prepareSession(
        mode: GameMode,
        amount?: number,
        prefferNewer?: boolean,
        skills?: ISkill[]
    ): Observable<ISession> {
        this.session = undefined;
        let words$: Observable<IRawWord[]>;
        this.lastGameMode = mode;
        if (mode == GameMode.PRACTICE_ALL) {
            words$ = this.languageDataService.pickPracticeAllWords(
                prefferNewer || false,
                amount || 10
            );
        } else {
            words$ = this.languageDataService.getWordsForSkills(skills || []);
        }
        this.session$ = words$.pipe(
            switchMap((words) =>
                this.languageDataService.findTranslations(words)
            ),
            map((translatedWords) => {
                let cards: ICard[] = translatedWords.map((word) => {
                    return new Card({ word });
                });
                this.session = { cards };
                console.log(this.session);
                return this.session;
            })
        );
        return this.session$;
    }

    public nextCard(): ICard | null {
        if (!this.session) {
            return null;
        }
        let remainingCards = this.session.cards.filter((card) => !card.seen);
        if (remainingCards.length == 0) {
            return null;
        }
        remainingCards[0].seen = true;
        return remainingCards[0];
    }

    public finishSession(): ISessionResults | null {
        if (!this.session) {
            return null;
        }
        const incorrect = this.session.cards.filter((card) => !card.correct);
        const totalCards = this.session.cards.length;
        this.lastSession = this.session;
        this.session = undefined;
        this.session$ = undefined;
        this.lastSessionResults = {
            correct: totalCards - incorrect.length,
            incorrect,
            total: totalCards,
        };
        return this.lastSessionResults;
    }

    private lastSessionResults?: ISessionResults;
    private lastSession?: ISession;
    private lastGameMode?: GameMode;

    public getLastSessionResults(): ISessionResults | undefined {
        return this.lastSessionResults;
    }

    public repeatIncorrect(): Observable<ISession> {
        const incorrectCards = this.lastSession?.cards
            .filter((card) => !card.correct)
            .map((card) => {
                card.seen = false;
                return card;
            });
        if (incorrectCards) {
            this.session = {
                cards: incorrectCards,
            };
        } else {
            this.session = {
                cards: [] as ICard[],
            };
        }
        return of(this.session);
    }

    public getLastGameMode(): GameMode | undefined {
        return this.lastGameMode;
    }
}
