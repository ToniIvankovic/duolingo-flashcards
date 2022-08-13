import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { MatCardModule } from '@angular/material/card';
import { LoginModule } from 'src/app/components/login/login.module';

@NgModule({
    declarations: [AuthLayoutComponent],
    exports: [AuthLayoutComponent],
    imports: [CommonModule, LoginModule, MatCardModule],
})
export class AuthLayoutModule {}
