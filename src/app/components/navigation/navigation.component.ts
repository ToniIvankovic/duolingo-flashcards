import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {}

    public onLogoutClick() {
        this.authService.logout();
        window.location.reload();
    }

    public onPracticeAllClick() {
        this.router.navigateByUrl('/practice_all');
    }

    public onLessonsClick() {
        this.router.navigateByUrl('/lessons');
    }
}
