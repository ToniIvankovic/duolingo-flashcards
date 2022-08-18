import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { CardModule } from '../card/card.module';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    declarations: [GameComponent],
    exports: [GameComponent],
    imports: [CommonModule, CardModule, LoaderModule],
})
export class GameModule {}
