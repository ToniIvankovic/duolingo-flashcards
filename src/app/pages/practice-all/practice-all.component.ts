import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    IApiData,
    ILanguage,
    ILanguageData,
} from 'src/app/interfaces/api-data.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageDataService } from 'src/app/services/language-data.service';

@Component({
    selector: 'app-practice-all',
    templateUrl: './practice-all.component.html',
    styleUrls: ['./practice-all.component.scss'],
})
export class PracticeAllComponent implements OnInit {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly languageDataService: LanguageDataService
    ) {}

    public apiData?: IApiData;
    public currentLanguage?: string;
    public lastLesson?: string;

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.http
            .get<IApiData>(
                `/api/users/${this.authService.getCurrentUser()?.username}`
            )
            .subscribe((apiData) => {
                this.loading = false;
                this.apiData = apiData;
                this.currentLanguage =
                    this.languageDataService.getCurrentLearningLanguage(
                        apiData
                    ).language_string;
                this.lastLesson =
                    this.languageDataService.calculateLastCompletedSkill(
                        apiData
                    ).title;
            });
    }

    public onStartClick(event: Event) {
        event.preventDefault();
        console.log(event);
    }
}
