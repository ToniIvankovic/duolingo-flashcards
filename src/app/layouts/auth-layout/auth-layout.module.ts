import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AuthLayoutComponent],
    exports: [AuthLayoutComponent],
    imports: [CommonModule, RouterModule],
})
export class AuthLayoutModule {}
