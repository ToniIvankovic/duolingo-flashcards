import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeAllComponent } from './practice-all.component';
import { LoaderModule } from 'src/app/components/loader/loader.module';

@NgModule({
    declarations: [PracticeAllComponent],
    exports: [PracticeAllComponent],
    imports: [CommonModule, LoaderModule],
})
export class PracticeAllModule {}
