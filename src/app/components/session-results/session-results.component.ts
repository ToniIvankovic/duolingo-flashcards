import { Component, Input, OnInit } from '@angular/core';
import { ISessionResults } from 'src/app/interfaces/card.interface';

@Component({
    selector: 'app-session-results',
    templateUrl: './session-results.component.html',
    styleUrls: ['./session-results.component.scss'],
})
export class SessionResultsComponent implements OnInit {
    @Input() results?: ISessionResults | null;
    constructor() {}

    ngOnInit(): void {}

    public get incorrectWords(): string[] | undefined {
        if (!this.results) return undefined;
        return this.results.incorrect.map((card) => card.word.word);
    }
}
