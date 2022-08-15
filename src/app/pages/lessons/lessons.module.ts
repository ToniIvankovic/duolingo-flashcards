import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonsComponent } from './lessons.component';

@NgModule({
    declarations: [LessonsComponent],
    exports: [LessonsComponent],
    imports: [CommonModule],
})
export class LessonsModule {}
