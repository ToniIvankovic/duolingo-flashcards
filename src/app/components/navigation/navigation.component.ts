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
            title: 'CHOOSE LANGUAGE',
            url: '',
            onClick: () => {},
        },
        {
            title: 'PRACTICE ALL',
            url: '/practice_all',
            onClick: () => {},
        },
        {
            title: 'LESSONS',
            url: '/lessons',
            onClick: () => {},
        },
        {
            title: 'LOGOUT',
            url: '/logout',
            onClick: () => {
                this.authService.logout();
                window.location.reload();
            },
        },
    ];
}
