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
import { LessonsComponent } from './pages/lessons/lessons.component';
import { LessonsModule } from './pages/lessons/lessons.module';
import { PracticeAllComponent } from './pages/practice-all/practice-all.component';
import { PracticeAllModule } from './pages/practice-all/practice-all.module';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: 'practice_all',
                component: PracticeAllComponent,
            },
            {
                path: 'lessons',
                component: LessonsComponent,
            },
        ],
    },
    {
        path: 'login',
        component: AuthLayoutComponent,
        canActivate: [AnonymousGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        MainLayoutModule,
        AuthLayoutModule,
        PracticeAllModule,
        LessonsModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
