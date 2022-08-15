import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-practice-all',
    templateUrl: './practice-all.component.html',
    styleUrls: ['./practice-all.component.scss'],
})
export class PracticeAllComponent implements OnInit {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {}

    public loading : boolean = false;
    ngOnInit(): void {
        this.loading = true;
        this.http
            .get(`/api/users/${this.authService.getCurrentUser()?.username}`)
            .subscribe((response) => {
                console.log(response);
                this.loading = false;
            });
    }
}
