import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [MainLayoutComponent],
    exports: [MainLayoutComponent],
    imports: [CommonModule, RouterModule],
})
export class MainLayoutModule {}
