import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { IApiData, ILanguage, ISkill } from '../interfaces/api-data.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageDataService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
        this.fetchApiData().subscribe();
    }

    private apiData$ = new ReplaySubject<IApiData>(1);
    
    private fetchApiData(): Observable<IApiData> {
        return this.http
            .get<IApiData>(
                `/api/users/${this.authService.getCurrentUser()?.username}`
            )
            .pipe(
                tap((apiData) => {
                    console.log(apiData);
                    this.apiData$.next(apiData);
                })
            );
    }

    public getLastCompletedSkill(): Observable<ISkill> {
        return this.apiData$.pipe(
            switchMap((apiData) => {
                return this.getCurrentLearningLanguage().pipe(
                    map((currentLanguage) => {
                        return apiData.language_data[currentLanguage.language];
                    })
                );
            }),
            map((languageData) => {
                const sortedSkills = this.generateSkillsInOrder(
                    languageData.skills,
                    true
                );
                return sortedSkills[sortedSkills.length - 1];
            })
        );
    }

    private generateSkillsInOrder(
        skills: ISkill[],
        onlyLearned: boolean = true
    ): ISkill[] {
        const root: ISkill = skills.filter(
            (skill) => skill.dependencies.length == 0
        )[0];
        const queue = [root];
        const sortedSkills = [];
        while (queue.length != 0) {
            const skill1 = queue.shift()!;
            if (onlyLearned && !skill1.learned) {
                continue;
            }
            for (let otherSkill of skills) {
                if (
                    otherSkill.dependencies.indexOf(skill1.title) != -1 &&
                    queue.indexOf(otherSkill) == -1
                ) {
                    queue.push(otherSkill);
                }
            }
            sortedSkills.push(skill1);
        }
        return sortedSkills;
    }

    public getCurrentLearningLanguage(): Observable<ILanguage> {
        return this.apiData$.pipe(
            map((apiData) => {
                return apiData.languages.filter(
                    (language) => language.current_learning
                )[0];
            })
        );
    }
}
