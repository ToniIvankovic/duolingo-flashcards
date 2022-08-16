import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [CardComponent],
    exports: [CardComponent],
    imports: [CommonModule, MatCardModule],
})
export class CardModule {}
