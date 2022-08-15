import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeAllComponent } from './practice-all.component';

@NgModule({
    declarations: [PracticeAllComponent],
    exports: [PracticeAllComponent],
    imports: [CommonModule],
})
export class PracticeAllModule {}
