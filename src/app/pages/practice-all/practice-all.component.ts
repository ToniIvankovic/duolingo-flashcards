import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatestWith, map, Observable, tap } from 'rxjs';
import { GameMode } from 'src/app/enums/game-modes.enum';
import { CardsGameService } from 'src/app/services/cards-game.service';
import { LanguageDataService } from 'src/app/services/language-data.service';

@Component({
    selector: 'app-practice-all',
    templateUrl: './practice-all.component.html',
    styleUrls: ['./practice-all.component.scss'],
})
export class PracticeAllComponent implements OnInit {
    constructor(
        private readonly languageDataService: LanguageDataService,
        private readonly cardsGameService: CardsGameService,
        private readonly router: Router
    ) {}

    public currentLanguage$?: Observable<string>;
    public lastLesson$?: Observable<string>;
    public amount: number | null = 20;
    public prefferNew: boolean = false;
    public reversed: boolean = false;

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.currentLanguage$ = this.languageDataService
            .getCurrentLearningLanguage()
            .pipe(map((language) => language.title));
        this.lastLesson$ = this.languageDataService
            .getLastPathCompletedUnit()
            .pipe(map((unit) => `Unit ${unit.unitIndex}: ${unit.teachingObjective}`));
        this.currentLanguage$
            .pipe(combineLatestWith(this.lastLesson$))
            .subscribe(() => (this.loading = false));
    }

    public onStartClick(event: Event) {
        event.preventDefault();
        if (!this.amount) return;
        this.cardsGameService.prepareSession(
            GameMode.PRACTICE_ALL,
            this.amount,
            this.prefferNew,
            undefined,
            this.reversed
        );
        this.router.navigateByUrl('/game');
    }

}
