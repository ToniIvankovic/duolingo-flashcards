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
    ) {
        window.onscroll = () => {
            this.opened = false;
        }
    }

    ngOnInit(): void {}

    public menus = [
        {
            title: 'CHOOSE LANGUAGE',
            url: '/choose_language',
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

    private _opened: boolean = false;
    public get opened(): boolean {
        return this._opened;
    }
    public set opened(value: boolean) {
        this._opened = value;
        if (value === true) {
            document.querySelector('.shadow')?.classList.add('opened');
            document.querySelector('.flexbox')?.classList.add('opened');
        } else {
            document.querySelector('.shadow')?.classList.remove('opened');
            document.querySelector('.flexbox')?.classList.remove('opened');
        }
    }
}
