import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameMode } from 'src/app/enums/game-modes.enum';
import { ISessionResults } from 'src/app/interfaces/card.interface';
import { CardsGameService } from 'src/app/services/cards-game.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
    public results?: ISessionResults | null;
    constructor(
        private readonly cardsGameService: CardsGameService,
        private readonly router: Router
    ) {
        this.results = cardsGameService.getLastSessionResults();
        if (!this.results) {
            this.router.navigateByUrl("/");
        }
    }

    ngOnInit(): void {}

    public onRepeatClick(){
        this.cardsGameService.repeatIncorrect().subscribe(() => {
            this.router.navigateByUrl("/game");
        });
    }

    public onPracticeAgainClick(){
        const lastGameMode = this.cardsGameService.getLastGameMode();
        if(lastGameMode == GameMode.PRACTICE_ALL){
            this.router.navigateByUrl('/practice_all');
        } else{
            this.router.navigateByUrl('/lessons');
        }
    }
}
