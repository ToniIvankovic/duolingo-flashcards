import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsComponent } from './components/cards/cards.component';
import { LoginComponent } from './components/login/login.component';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                component: CardsComponent,
            },
            // {
            //     path: '**',
            //     redirectTo: '',
            // },
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [AnonymousGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/login',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes), MainLayoutModule, AuthLayoutModule],
    exports: [RouterModule],
})
export class AppRoutingModule {}
