import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatestWith, map, Observable, tap } from 'rxjs';
import { GameMode } from 'src/app/enums/game-modes.enum';
import {
    IApiData,
    ILanguage,
    ILanguageData,
} from 'src/app/interfaces/api-data.interface';
import { AuthService } from 'src/app/services/auth.service';
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
        private readonly router : Router
    ) {}

    public currentLanguage$?: Observable<string>;
    public lastLesson$?: Observable<string>;

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.currentLanguage$ = this.languageDataService
            .getCurrentLearningLanguage()
            .pipe(map((language) => language.language_string));
        this.lastLesson$ = this.languageDataService
            .getLastCompletedSkill()
            .pipe(map((skill) => skill.title));
        this.currentLanguage$
            .pipe(combineLatestWith(this.lastLesson$))
            .subscribe(() => (this.loading = false));
    }

    public onStartClick(event: Event) {
        let amount = 10;
        event.preventDefault();
        this.cardsGameService
            .prepareSession(GameMode.PRACTICE_ALL, amount, true)
            .subscribe(() => {
                this.router.navigateByUrl('/game');
            });
    }
}
