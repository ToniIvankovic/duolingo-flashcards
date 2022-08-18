import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameMode } from 'src/app/enums/game-modes.enum';
import { ICard, IWord } from 'src/app/interfaces/card.interface';
import { CardsGameService } from 'src/app/services/cards-game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    public card: ICard | null = null;
    @Input() gameMode: GameMode = GameMode.PRACTICE_ALL;
    @Input() amount: number = 10;
    @Input() prefferNew?: boolean = false;
    @Input() lesson?: string;
    @Output() done = new EventEmitter<boolean>();
    public index: number = 0;
    public loading: boolean = false;

    constructor(private readonly cardsGameService: CardsGameService) {
        this.loading = true;
        cardsGameService
            .prepareSession(this.gameMode, this.amount, this.prefferNew)
            .subscribe(() => {
                this.loading = false;
                this.card = cardsGameService.nextCard();
                this.index = 1;
            });
    }

    ngOnInit(): void {}

    public onNextClick() {
        this.card = this.cardsGameService.nextCard();
        this.index++;
        if (this.card == null) {
            this.done.emit(true);
            return;
        }
    }
}
