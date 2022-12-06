import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    flatMap,
    forkJoin,
    map,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    switchMap,
    tap,
} from 'rxjs';
import {
    ITreeApiData,
    ITreeLanguage,
    ITreeLanguageData,
    ITreeSkill,
    IPathApiData,
    IPathCourseExtended,
    IPathCourse,
    IPathLevel,
    IPathUnit,
} from '../interfaces/api-data.interface';
import { IRawWord, IWord } from '../interfaces/card.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageDataService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
        this.fetchTreeApiData().subscribe();
        this.fetchPathApiData().subscribe();
    }

    private readonly urlTreeApi = '/api/users';
    private readonly urlPathApi = '/api/2017-06-30/users';
    private readonly swicthLanguageUrl = 'api/switch_language';
    // private readonly urlApi = 'https://www.duolingo.com/users';
    private readonly dictionaryApiUrl = '/dictionary-api';
    // private readonly dictionaryApiUrl = 'https://d2.duolingo.com/api/1/dictionary/hints';
    private readonly newnessThreshold: number = 100;
    private readonly newWordsProbability: number = 0.9;

    private treeApiData$ = new ReplaySubject<ITreeApiData>(1);
    private pathApiData$ = new ReplaySubject<IPathApiData>(1);

    private fetchTreeApiData(): Observable<ITreeApiData> {
        return this.http
            .get<ITreeApiData>(
                `${this.urlTreeApi}/${
                    this.authService.getCurrentUser()?.username
                }`
            )
            .pipe(
                tap((apiData) => {
                    console.log(apiData);
                    this.treeApiData$.next(apiData);
                })
            );
    }

    private fetchPathApiData(): Observable<IPathApiData> {
        return this.http
            .get<IPathApiData>(
                `${this.urlPathApi}/${
                    this.authService.getCurrentUser()?.user_id
                }?fields=courses,currentCourse`
            )
            .pipe(
                tap((apiData) => {
                    console.log(apiData);
                    this.pathApiData$.next(apiData);
                })
            );
    }

    public getLastPathCompletedUnit(): Observable<IPathUnit> {
        return this.getEligibleUnitsList().pipe(
            map((units) => units[units.length - 1])
        );
    }

    private getCurrentLanguageData(): Observable<IPathCourseExtended> {
        return this.pathApiData$.pipe(map((apiData) => apiData.currentCourse));
    }

    // private generateSkillsInOrder(
    //     skills: ITreeSkill[],
    //     onlyLearned: boolean = true
    // ): ITreeSkill[] {
    //     const root: ITreeSkill = skills.filter(
    //         (skill) => skill.dependencies.length == 0
    //     )[0];
    //     const queue = [root];
    //     const sortedSkills = [];
    //     while (queue.length != 0) {
    //         const skill1 = queue.shift()!;
    //         if (onlyLearned && !skill1.learned) {
    //             continue;
    //         }
    //         for (let otherSkill of skills) {
    //             if (
    //                 otherSkill.dependencies.indexOf(skill1.title) != -1 &&
    //                 queue.indexOf(otherSkill) == -1
    //             ) {
    //                 queue.push(otherSkill);
    //             }
    //         }
    //         sortedSkills.push(skill1);
    //     }
    //     return sortedSkills;
    // }

    public getCurrentLearningLanguage(): Observable<IPathCourse> {
        return this.pathApiData$.pipe(
            map((apiData) => {
                return apiData.currentCourse;
            })
        );
    }

    private connectStringToLowerCase(str: string): string {
        return str.toLowerCase().split(' ').join('');
    }

    //TODO
    private getAllWords(): Observable<IRawWord[]> {
        return this.getCurrentLanguageData().pipe(
            map((langData) => {
                let units = langData.path;
                const words: IRawWord[] = [];
                // units.forEach((unit) =>
                //     words.push(
                //         ...skill.words
                //             .filter(
                //                 //Exclude unimportant words (lesson name)
                //                 (word) =>
                //                     !this.connectStringToLowerCase(
                //                         word
                //                     ).includes(
                //                         this.connectStringToLowerCase(
                //                             skill.name
                //                         )
                //                     ) && !word.includes('+prpers')
                //             )
                //             .map((word) => ({
                //                 word,
                //                 skill,
                //             }))
                //     )
                // );
                return words;
            })
        );
    }

    public pickPracticeAllWords(
        prefferNewer: boolean,
        amount: number
    ): Observable<IRawWord[]> {
        return this.getAllWords().pipe(
            map((allWords) => {
                allWords.reverse();
                const chosenWords = [];
                let index;
                for (let i = 0; i < amount; i++) {
                    // Choosing the index
                    if (!prefferNewer) {
                        index = Math.floor(Math.random() * allWords.length);
                    } else {
                        if (Math.random() > this.newWordsProbability) {
                            index = Math.floor(Math.random() * allWords.length);
                        } else {
                            index = Math.floor(
                                Math.random() * this.newnessThreshold
                            );
                        }
                    }
                    const chosenWord = allWords[index];
                    if (
                        chosenWords
                            .map((word) => word.word)
                            .includes(chosenWord.word)
                    ) {
                        //Duplicate
                        i--;
                    } else {
                        chosenWords.push(chosenWord);
                    }
                }
                return chosenWords;
            })
        );
    }

    public findTranslation(foreignWord: IRawWord): Observable<IWord> {
        return this.http
            .get<{ [foreignWord: string]: string[] }>(
                this.dictionaryApiUrl + '/es/en?' + foreignWord.word
            )
            .pipe(
                map((apiTranslations) => {
                    let translations = apiTranslations[foreignWord.word];
                    return {
                        word: foreignWord.word,
                        translations: translations,
                        skill: foreignWord.skill,
                    };
                })
            );
    }

    public findTranslations(foreignWords: IRawWord[]): Observable<IWord[]> {
        const stringArray = `[${foreignWords.map(
            (iWord) => `"${iWord.word}"`
        )}]`;
        return this.http
            .get<{ [foreignWord: string]: string[] }>(
                '/dictionary-api/es/en?tokens=' + stringArray
            )
            .pipe(
                map((apiTranslations) => {
                    const translatedWords: IWord[] = [];
                    foreignWords.forEach((foreignWord) => {
                        let translations = apiTranslations[foreignWord.word];
                        translatedWords.push({
                            word: foreignWord.word,
                            translations: translations,
                            skill: foreignWord.skill,
                        });
                    });
                    return translatedWords;
                })
            );
    }

    public getEligibleUnitsList(): Observable<IPathUnit[]> {
        return this.getCurrentLanguageData().pipe(
            map((languageData) => {
                return languageData.path.filter((unit) => {
                    return (
                        unit.levels.filter((level) => level.state === 'passed')
                            .length > 0
                    );
                });
            })
        );
    }

    public getWordsForUnits(units: IPathUnit[]): Observable<IWord[]> {
        //Fill an array with IRawWord objects received from getWordsForUnit for each unit in units and return the array as observable
        return forkJoin(units.map((unit) => this.getWordsForUnit(unit))).pipe(
            map((words) => words.flat())
        );
    }

    public getWordsForUnit(unit: IPathUnit): Observable<IWord[]> {
        //For each level in unit.levels, find an equivalent skill in treeApiData$ skills and get words from that skills with getWordsForSkill
        return this.treeApiData$.pipe(
            map((treeApiData) => treeApiData.language_data),
            switchMap((languageData) => {
                return this.getCurrentLearningLanguage().pipe(
                    map(
                        (currentCourse) =>
                            languageData[currentCourse.learningLanguage].skills
                    )
                );
            }),
            switchMap((treeSkills) => {
                return forkJoin(
                    unit.levels.map((level) => {
                        const skills = treeSkills.filter(
                            (skill) =>
                                skill.id === level.pathLevelMetadata.skillId ||
                                level.pathLevelMetadata.skillIds?.includes(
                                    skill.id
                                )
                        );
                        return this.getWordsForSkills(skills);
                    })
                ).pipe(map((words) => words.flat()));
            })
        );
    }

    public getWordsForSkills(skills: ITreeSkill[]): Observable<IWord[]> {
        return this.findTranslations(
            skills.flatMap((skill) => {
                return skill.words.map((word) => {
                    return {
                        word,
                        skill,
                    };
                });
            })
        );
    }

    public getLearningLanguages(): Observable<IPathCourse[]> {
        return this.pathApiData$.pipe(map((apiData) => apiData.courses));
    }
    // public getLearningLanguages(): Observable<IPathCourse[]> {
    //     return this.pathApiData$.pipe(map((apiData) => apiData.courses));
    // }

    public switchLanguage(newLanguage: IPathCourse): Observable<void> {
        return this.http
            .post(this.swicthLanguageUrl, {
                learning_language: newLanguage.learningLanguage,
            })
            .pipe(
                map((resp) => {
                    console.log(resp);
                })
            );
    }
}
