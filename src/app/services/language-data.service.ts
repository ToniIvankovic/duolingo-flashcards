import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import {
    IApiData,
    ILanguage,
    ILanguageData,
    ISkill,
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
        this.fetchApiData().subscribe();
    }

    // private readonly urlApi = '/api/users';
    private readonly urlApi = 'https://www.duolingo.com/users';
    private readonly dictionaryApiUrl = 'https://d2.duolingo.com/api/1/dictionary/hints';
    private readonly newnessThreshold: number = 100;
    private readonly newWordsProbability: number = 0.9;

    private apiData$ = new ReplaySubject<IApiData>(1);

    private fetchApiData(): Observable<IApiData> {
        return this.http
            .get<IApiData>(
                `${this.urlApi}/${this.authService.getCurrentUser()?.username}`
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

    private connectStringToLowerCase(str: string): string {
        return str.toLowerCase().split(' ').join('');
    }

    private getAllWords(): Observable<IRawWord[]> {
        let skillsInOrder$ = this.getCurrentLanguageData().pipe(
            map((langData) => this.generateSkillsInOrder(langData.skills, true))
        );
        return skillsInOrder$.pipe(
            map((skills) => {
                const words: IRawWord[] = [];
                skills.forEach((skill) =>
                    words.push(
                        ...skill.words
                            .filter(
                                //Exclude unimportant words (lesson name)
                                (word) =>
                                    !this.connectStringToLowerCase(
                                        word
                                    ).includes(
                                        this.connectStringToLowerCase(
                                            skill.name
                                        )
                                    ) && !word.includes('+prpers')
                            )
                            .map((word) => ({
                                word,
                                skill,
                            }))
                    )
                );
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

    public getSkillsList(): Observable<ISkill[]> {
        return this.getCurrentLanguageData().pipe(
            map((languageData) => {
                const sortedSkills = this.generateSkillsInOrder(
                    languageData.skills,
                    true
                ).filter((skill) => {
                    console.log(skill);
                    console.log(skill.words);
                    let retval = !skill.words.every((word) =>
                        this.connectStringToLowerCase(word).includes(
                            this.connectStringToLowerCase(skill.name)
                        )
                    );
                    console.log(retval);
                    return retval;
                });
                return sortedSkills;
            })
        );
    }

    public getWordsForSkills(skills: ISkill[]): Observable<IWord[]> {
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

    public getLearningLanguages(): Observable<ILanguage[]> {
        return this.apiData$.pipe(
            map((apiData) =>
                apiData.languages.filter((language) => language.learning)
            )
        );
    }
    public switchLanguage(newLanguage: ILanguage): Observable<void> {
        return this.http
            .post('api/switch_language', {
                learning_language: newLanguage.language,
            })
            .pipe(
                map((resp) => {
                    console.log(resp);
                })
            );
    }
}
