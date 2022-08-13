import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards.component';

@NgModule({
    declarations: [CardsComponent],
    exports: [CardsComponent],
    imports: [CommonModule],
})
export class CardsModule {}
