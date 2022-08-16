import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import {
    IApiData,
    ILanguage,
    ILanguageData,
    ISkill,
} from '../interfaces/api-data.interface';
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
        return this.getCurrentLanguageData().pipe(
            map((languageData) => {
                const sortedSkills = this.generateSkillsInOrder(
                    languageData.skills,
                    true
                );
                return sortedSkills[sortedSkills.length - 1];
            })
        );
    }

    private getCurrentLanguageData(): Observable<ILanguageData> {
        return this.apiData$.pipe(
            switchMap((apiData) => {
                return this.getCurrentLearningLanguage().pipe(
                    map((currentLanguage) => {
                        return apiData.language_data[currentLanguage.language];
                    })
                );
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

    private getAllWords(): Observable<string[]> {
        function connectStringToLowerCase(str: string): string {
            return str.toLowerCase().split(' ').join('');
        }
        
        let skillsInOrder$ = this.getCurrentLanguageData().pipe(
            map((langData) => this.generateSkillsInOrder(langData.skills, true))
        );
        return skillsInOrder$.pipe(
            map((skills) => {
                const words: string[] = [];
                skills.forEach((skill) =>
                    words.push(
                        ...skill.words.filter(
                            (word) =>
                                !word.includes(
                                    connectStringToLowerCase(skill.name)
                                )
                        )
                    )
                );
                return words;
            })
        );
    }

    public pickPracticeAllWords(
        prefferNewer: boolean,
        amount: number
    ): Observable<string[]> {
        return this.getAllWords().pipe(
            map((allWords) => {
                allWords.reverse();
                const chosenWords = [];
                let index;
                for (let i = 0; i < amount; i++) {
                    if (!prefferNewer) {
                        index = Math.floor(Math.random() * allWords.length);
                    } else {
                        const newnessThreshold: number = 100;
                        const newWordsProbability: number = 0.8;
                        if (Math.random() > newWordsProbability) {
                            index = Math.floor(Math.random() * allWords.length);
                        } else {
                            index = Math.floor(
                                Math.random() * newnessThreshold
                            );
                        }
                    }
                    const chosenWord = allWords[index];
                    if (!(chosenWord in chosenWords)) {
                        chosenWords.push(chosenWord);
                    } else {
                        i--;
                    }
                }
                return chosenWords;
            })
        );
    }
}
