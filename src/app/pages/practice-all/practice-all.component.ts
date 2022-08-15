import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IApiData, ILanguageData } from 'src/app/interfaces/api-data.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-practice-all',
    templateUrl: './practice-all.component.html',
    styleUrls: ['./practice-all.component.scss'],
})
export class PracticeAllComponent implements OnInit {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {}

    public languageData?: ILanguageData;
    public lastLesson?: string;

    public loading: boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.http
            .get<IApiData>(
                `/api/users/${this.authService.getCurrentUser()?.username}`
            )
            .subscribe((response) => {
                console.log(response);
                this.loading = false;
                let currentLanguage = response.languages.filter(
                    (language) => language.current_learning
                )[0];
                this.languageData =
                    response.language_data[currentLanguage.language];
                let completedSkills = this.languageData.skills.filter(
                    (skill) => skill.learned
                );
                this.lastLesson =
                    completedSkills[completedSkills.length - 1].title;
                console.log(this.languageData);
            });
    }
}
