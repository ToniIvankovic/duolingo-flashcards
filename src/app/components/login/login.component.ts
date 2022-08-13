import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loggedIn: boolean = false;
    public jwtToken: string;
    private loginURI = '/api/login';
    public form: FormGroup;

    constructor(private readonly http: HttpClient) {
        this.form = new FormGroup({
            login: new FormControl(''),
            password: new FormControl(''),
        });

        this.jwtToken = sessionStorage.getItem('jwt') || '';
        if (this.jwtToken) {
            this.loggedIn = true;
        }
    }

    ngOnInit(): void {}

    public onLoginClick(event: Event) {
        event.preventDefault();
        let request = this.http.post(
            this.loginURI,
            {
                login: this.form.controls['login'].value,
                password: this.form.controls['password'].value,
            },
            {
                observe: 'response',
                responseType: 'json',
                withCredentials: true
            }
        ) as Observable<HttpResponse<{
            response: string;
            username: string;
            user_id: string;
        }>>;

        request.subscribe((response) => {
            this.http.get(
                `/api/users/${response.body?.username}`,
            ).subscribe(console.log);
        });
    }
}
