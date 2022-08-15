import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeAllComponent } from './practice-all.component';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    declarations: [PracticeAllComponent],
    exports: [PracticeAllComponent],
    imports: [CommonModule, LoaderModule, MatCheckboxModule],
})
export class PracticeAllModule {}
