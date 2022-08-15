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

    public menus = [
        {
            title: "PRACTICE ALL",
            url: '/practice_all',
            onClick: () => {
                this.router.navigateByUrl('/practice_all');
            },
        },
        {
            title: "LESSONS",
            url: '/lessons',
            onClick: () => {
                this.router.navigateByUrl('/lessons');
            },
        },
        {
            title: "LOGOUT",
            url: '/logout',
            onClick: () => {
                this.authService.logout();
                window.location.reload();
            },
        },
    ];
}
