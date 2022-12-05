import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICard } from 'src/app/interfaces/card.interface';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnChanges {
    @Input() card: ICard | null = null;
    public clicked : boolean = false;

    public get translations() : string{
        return this.card?.word.translations.join(", ") || "";
    }
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        this.clicked = false;
    }

    ngOnInit(): void {}
}
