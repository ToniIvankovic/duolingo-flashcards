import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonsComponent } from './lessons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [LessonsComponent],
    exports: [LessonsComponent],
    imports: [CommonModule, MatCheckboxModule, LoaderModule, MatButtonModule, MatInputModule, FormsModule],
})
export class LessonsModule {}
