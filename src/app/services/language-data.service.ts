import { Injectable } from '@angular/core';
import { IApiData, ILanguage, ISkill } from '../interfaces/api-data.interface';

@Injectable({
    providedIn: 'root',
})
export class LanguageDataService {
    constructor() {}

    public calculateLastCompletedSkill(apiData: IApiData): ISkill {
        let languageData =
            apiData.language_data[
                this.getCurrentLearningLanguage(apiData).language
            ];
        // let completedSkills = languageData.skills.filter(
        //     (skill) => skill.learned
        // );
        const sortedSkills = this.generateSkillsInOrder(languageData.skills, true);
        return sortedSkills[sortedSkills.length - 1];
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

    public getCurrentLearningLanguage(apiData: IApiData): ILanguage {
        return apiData.languages.filter(
            (language) => language.current_learning
        )[0];
    }
}
