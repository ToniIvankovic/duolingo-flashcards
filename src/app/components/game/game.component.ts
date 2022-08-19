import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    public gameMode: GameMode = GameMode.PRACTICE_ALL;
    public prefferNew?: boolean = false;
    public lesson?: string;
    public index: number = 0;
    public loading: boolean = false;
    public amount: number = 10;

    constructor(
        private readonly cardsGameService: CardsGameService,
        private readonly router: Router
    ) {
        this.loading = true;
        let session$ = cardsGameService.existingSession();
        if (!session$) {
            this.router.navigateByUrl('/');
        } else {
            session$.subscribe((session) => {
                this.loading = false;
                this.card = cardsGameService.nextCard();
                this.index = 1;
                this.amount = session.cards.length;
            });
        }
    }

    ngOnInit(): void {}

    public onNextClick() {
        this.card = this.cardsGameService.nextCard();
        this.index++;
        if (this.card == null) {
            return;
        }
    }
}
