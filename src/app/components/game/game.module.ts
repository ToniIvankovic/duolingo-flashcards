import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { CardModule } from '../card/card.module';

@NgModule({
    declarations: [GameComponent],
    exports: [GameComponent],
    imports: [CommonModule, CardModule],
})
export class GameModule {}
