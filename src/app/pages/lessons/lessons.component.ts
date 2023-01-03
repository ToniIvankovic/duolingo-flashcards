import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatestWith, map, Observable, tap } from 'rxjs';
import { GameMode } from 'src/app/enums/game-modes.enum';
import { IPathUnit, ITreeSkill } from 'src/app/interfaces/api-data.interface';
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
    public skillsList$?: Observable<IPathUnit[]>;
    public skillsList?: IPathUnit[];
    public filteredSkillsList?: IPathUnit[];
    public chosenSkills: IPathUnit[] = [];
    public filterValue: string = '';

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.currentLanguage$ = this.languageDataService
            .getCurrentLearningLanguage()
            .pipe(map((language) => language.title));
        this.skillsList$ = this.languageDataService.getEligibleUnitsList();
        this.skillsList$.subscribe((list) => {
            this.skillsList = list;
        });
        this.currentLanguage$
            .pipe(combineLatestWith(this.skillsList$))
            .subscribe(() => {
                this.onFilterChange('');
                this.loading = false;
            });
    }

    public onChange(change: MatCheckboxChange, skill: IPathUnit) {
        if (change.checked) {
            this.chosenSkills.push(skill);
        } else {
            const index = this.chosenSkills.indexOf(skill);
            if (index != -1) {
                this.chosenSkills.splice(index,1);
            }
        }
    }

    public onFilterChange(event: string) {
        this.filterValue = event;
        this.filteredSkillsList = this.skillsList?.filter((skill) =>
            skill.teachingObjective.toLowerCase().includes(this.filterValue.toLowerCase())
            || skill.unitIndex.toString().includes(this.filterValue)
        );
    }

    public onStartClick(event: Event) {
        event.preventDefault();
        console.log(this.chosenSkills.map((skill) => skill.teachingObjective));
        this.cardsGameService.prepareSession(
            GameMode.CHOSEN_LESSONS,
            undefined,
            undefined,
            this.chosenSkills
        );
        this.router.navigateByUrl('/game');
    }
}
