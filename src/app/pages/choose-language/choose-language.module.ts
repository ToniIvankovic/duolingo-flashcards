import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseLanguageComponent } from './choose-language.component';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [ChooseLanguageComponent],
    exports: [ChooseLanguageComponent],
    imports: [CommonModule, LoaderModule, MatButtonModule],
})
export class ChooseLanguageModule {}
