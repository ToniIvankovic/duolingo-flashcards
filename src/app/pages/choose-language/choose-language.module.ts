import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseLanguageComponent } from './choose-language.component';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import { MatButtonModule } from '@angular/material/button';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [ChooseLanguageComponent],
    exports: [ChooseLanguageComponent],
    imports: [CommonModule, LoaderModule, MatButtonModule, AngularSvgIconModule],
})
export class ChooseLanguageModule {}
