import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { CardModule } from '../card/card.module';
import { LoaderModule } from '../loader/loader.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SessionResultsModule } from '../session-results/session-results.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [GameComponent],
    exports: [GameComponent],
    imports: [
        CommonModule,
        CardModule,
        LoaderModule,
        MatButtonModule,
        MatIconModule,
        SessionResultsModule,
        MatCardModule
    ],
})
export class GameModule {}
