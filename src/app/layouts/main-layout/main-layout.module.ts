import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { NavigationModule } from 'src/app/components/navigation/navigation.module';

@NgModule({
    declarations: [MainLayoutComponent],
    exports: [MainLayoutComponent],
    imports: [CommonModule, RouterModule, NavigationModule],
})
export class MainLayoutModule {}
