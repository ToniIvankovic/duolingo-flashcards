import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    combineLatest,
    filter,
    flatMap,
    forkJoin,
    map,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    switchMap,
    take,
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
import { TranslationResponse } from '../interfaces/google_obj.interface';
import { AuthService } from './auth.service';
import { TranslationService } from './translation.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageDataService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly translationService: TranslationService
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

    public getCurrentLearningLanguage(): Observable<IPathCourse> {
        return this.pathApiData$.pipe(
            map((apiData) => {
                return apiData.currentCourse;
            })
        );
    }

    private getAllWords(): Observable<IRawWord[]> {
        return this.getEligibleUnitsList().pipe(
            switchMap((units) => {
                return this.getWordsForUnits(units);
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
        const stringArray = foreignWords.map((iWord) => `${iWord.word}`);
        console.log(stringArray);
        return this.getCurrentLearningLanguage()
            .pipe(
                switchMap((language) =>
                    this.translationService.translate({
                        q: stringArray,
                        target: language.fromLanguage,
                        source: language.learningLanguage,
                    })
                )
            )
            .pipe(
                map((translations) => {
                    return foreignWords.map((iWord) => {
                        let index = stringArray.indexOf(iWord.word);
                        return {
                            word: iWord.word,
                            translations: [
                                (translations as TranslationResponse).data
                                    .translations[index].translatedText,
                            ],
                            skill: iWord.skill,
                        };
                    });
                })
            );
        // return this.http
        //     .get<{ [foreignWord: string]: string[] }>(
        //         '/dictionary-api/es/en?tokens=' + stringArray
        //     )
        //     .pipe(
        //         map((apiTranslations) => {
        //             const translatedWords: IWord[] = [];
        //             foreignWords.forEach((foreignWord) => {
        //                 let translations = apiTranslations[foreignWord.word];
        //                 translatedWords.push({
        //                     word: foreignWord.word,
        //                     translations: translations,
        //                     skill: foreignWord.skill,
        //                 });
        //             });
        //             return translatedWords;
        //         })
        //     );
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

    public getWordsForUnits(units: IPathUnit[]): Observable<IRawWord[]> {
        //Fill an array with IRawWord objects received from getWordsForUnit for each unit in units and return the array as observable
        let wordsFromUnits$ = units.map((unit) => this.getWordsForUnit(unit));
        return combineLatest(wordsFromUnits$).pipe(
            take(1),
            map((words) => {
                //flatten the words array and remove duplicate values
                const wordsSet = new Array<IRawWord>();
                const addedWords = new Array<string>();
                words.forEach((unitWords) => {
                    unitWords.forEach((word) => {
                        if (!addedWords.includes(word.word)) {
                            wordsSet.push(word);
                            addedWords.push(word.word);
                        }
                    })
                });
                return Array.from(wordsSet);
            })
        );
    }

    public getWordsForUnit(unit: IPathUnit): Observable<IRawWord[]> {
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
            map((treeSkills) => {
                return unit.levels.flatMap((level) => {
                    const skills = treeSkills.filter(
                        (skill) =>
                            skill.id === level.pathLevelMetadata.skillId ||
                            level.pathLevelMetadata.skillIds?.includes(skill.id)
                    );
                    let words = this.getWordsForSkills(skills);
                    return words;
                });
            })
        );
    }

    public getWordsForSkills(skills: ITreeSkill[]): IRawWord[] {
        return skills.flatMap((skill) => {
            return skill.words.map((word) => {
                return {
                    word,
                    skill,
                } as IRawWord;
            });
        });
    }

    public getLearningLanguages(): Observable<IPathCourse[]> {
        return this.pathApiData$.pipe(
            map((apiData) =>
                apiData.courses.filter(
                    (course) => course.id != apiData.currentCourse.id
                )
            )
        );
    }
    // public getLearningLanguages(): Observable<IPathCourse[]> {
    //     return this.pathApiData$.pipe(map((apiData) => apiData.courses));
    // }

    public switchLanguage(newLanguage: IPathCourse): Observable<void> {
        return this.http
            .patch(
                `${this.urlPathApi}/${
                    this.authService.getCurrentUser()?.user_id
                }?fields=courses,currentCourse,fromLanguage,learningLanguage`,
                {
                    fromLanguage: newLanguage.fromLanguage,
                    learningLanguage: newLanguage.learningLanguage,
                    signal: null,
                }
            )
            .pipe(
                map((resp) => {
                    console.log(resp);
                })
            );
    }
}
