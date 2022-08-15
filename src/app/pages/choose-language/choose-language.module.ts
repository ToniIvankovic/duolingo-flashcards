import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseLanguageComponent } from './choose-language.component';

@NgModule({
    declarations: [ChooseLanguageComponent],
    exports: [ChooseLanguageComponent],
    imports: [CommonModule],
})
export class ChooseLanguageModule {}
