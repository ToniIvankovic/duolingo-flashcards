import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { ILanguage } from 'src/app/interfaces/api-data.interface';
import { LanguageDataService } from 'src/app/services/language-data.service';

@Component({
    selector: 'app-choose-language',
    templateUrl: './choose-language.component.html',
    styleUrls: ['./choose-language.component.scss'],
})
export class ChooseLanguageComponent implements OnInit {
    public learningLanguages?: ILanguage[];
    public currentLanguage?: ILanguage;
    public loadingData: boolean = false;
    public switchingLanguage: boolean = false;

    constructor(private readonly langDataService: LanguageDataService) {
        this.loadingData = true;
        this.langDataService
            .getCurrentLearningLanguage()
            .subscribe((currentLanguage) => {
                this.currentLanguage = currentLanguage;

                this.langDataService
                    .getLearningLanguages()
                    .subscribe((learningLanguages) => {
                        this.learningLanguages = learningLanguages.filter(
                            (learningLanguage) =>
                                learningLanguage != this.currentLanguage
                        );
                        this.loadingData = false;
                    });
            });
    }

    ngOnInit(): void {}
    public onSwitchClick(language: ILanguage) {
        this.switchingLanguage = true;
        this.langDataService.switchLanguage(language).subscribe((_resp) => {
            location.reload();
        });
    }
}
