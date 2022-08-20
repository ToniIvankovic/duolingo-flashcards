import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { GameModule } from './components/game/game.module';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { ChooseLanguageComponent } from './pages/choose-language/choose-language.component';
import { ChooseLanguageModule } from './pages/choose-language/choose-language.module';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { LessonsModule } from './pages/lessons/lessons.module';
import { PracticeAllComponent } from './pages/practice-all/practice-all.component';
import { PracticeAllModule } from './pages/practice-all/practice-all.module';
import { ResultsComponent } from './pages/results/results.component';
import { ResultsModule } from './pages/results/results.module';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                component: ChooseLanguageComponent,
            },
            {
                path: 'practice_all',
                component: PracticeAllComponent,
            },
            {
                path: 'game',
                component: GameComponent,
            },
            {
                path: 'lessons',
                component: LessonsComponent,
            },
            {
                path: 'results',
                component: ResultsComponent,
            }
        ],
    },
    {
        path: 'login',
        component: AuthLayoutComponent,
        canActivate: [AnonymousGuard],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        MainLayoutModule,
        AuthLayoutModule,
        PracticeAllModule,
        LessonsModule,
        ChooseLanguageModule,
        GameModule,
        ResultsModule
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
