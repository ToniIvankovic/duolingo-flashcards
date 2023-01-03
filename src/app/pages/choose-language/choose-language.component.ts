import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { IPathCourse, ITreeLanguage } from 'src/app/interfaces/api-data.interface';
import { LanguageDataService } from 'src/app/services/language-data.service';

@Component({
    selector: 'app-choose-language',
    templateUrl: './choose-language.component.html',
    styleUrls: ['./choose-language.component.scss'],
})
export class ChooseLanguageComponent implements OnInit {
    public learningLanguages?: IPathCourse[];
    public currentLanguage?: IPathCourse;
    public loadingData: boolean = false;
    public switchingLanguage: boolean = false;
    public flagsLocations: { [key: string]: string } = {
        en: '0',
        es: '66',
        fr: '132',
        de: '198',
        ja: '264',
        it: '330',
        ko: '396',
        zh: '462',
        ru: '528',
        pt: '594',
        tr: '660',
        nl: '726',
        sv: '792',
        ga: '858',
        el: '924',
        he: '990',
        pl: '1056',
        no: '1122',
        vi: '1188',
        da: '1254',
        hv: '1320',
        ro: '1386',
        sw: '1452',
        eo: '1518',
        hu: '1584',
        cy: '1650',
        uk: '1716',
        kl: '1782',
        cs: '1848',
        hi: '1914',
        id: '1980',
        ha: '2046',
        nv: '2112',
        ar: '2178',
        ca: '2244',
        th: '2310',
        gn: '2376',
        ambassador: '2442',
        duolingo: '2508',
        troubleshooting: '2574',
        teachers: '2640',
        la: '2706',
        gd: '2772',
        fi: '2838',
        Yiddish: '2904',
    };

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
    public onSwitchClick(language: IPathCourse) {
        this.switchingLanguage = true;
        this.langDataService.switchLanguage(language).subscribe((_resp) => {
            location.reload();
        });
    }
}
