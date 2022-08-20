import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { combineLatestWith, map, Observable } from 'rxjs';
import { GameMode } from 'src/app/enums/game-modes.enum';
import { ISkill } from 'src/app/interfaces/api-data.interface';
import { CardsGameService } from 'src/app/services/cards-game.service';
import { LanguageDataService } from 'src/app/services/language-data.service';

@Component({
    selector: 'app-lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent implements OnInit {
    constructor(
        private readonly languageDataService: LanguageDataService,
        private readonly cardsGameService: CardsGameService,
        private readonly router: Router
    ) {}

    public currentLanguage$?: Observable<string>;
    public skillsList$? : Observable<ISkill[]>;
    public chosenSkills : ISkill[] = [];

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.currentLanguage$ = this.languageDataService
            .getCurrentLearningLanguage()
            .pipe(map((language) => language.language_string));
        this.skillsList$ = this.languageDataService.getSkillsList();
        this.currentLanguage$
            .pipe(combineLatestWith(this.skillsList$))
            .subscribe(() => (this.loading = false));
    }

    public onChange(change: MatCheckboxChange, skill: ISkill){
        if(change.checked){
            this.chosenSkills.push(skill);
        } else{
            const index = this.chosenSkills.indexOf(skill);
            if(index != -1){
                this.chosenSkills.splice(index);
            }
        }
    }

    public onStartClick(event: Event) {
        event.preventDefault();
        console.log(this.chosenSkills.map(skill => skill.title));
        this.cardsGameService
            .prepareSession(GameMode.CHOSEN_LESSONS, undefined, undefined, this.chosenSkills);
        this.router.navigateByUrl('/game');
    }
}
