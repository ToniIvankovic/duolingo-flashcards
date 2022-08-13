import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loggedIn: boolean = false;
    public form: FormGroup;
    public loading: boolean = false;

    constructor(private readonly authService: AuthService, private readonly router :Router) {
        this.form = new FormGroup({
            login: new FormControl(''),
            password: new FormControl(''),
        });
    }

    ngOnInit(): void {}

    public onLoginClick(event: Event) {
        event.preventDefault();
        this.loading = true;
        this.authService.login(this.form.controls['login'].value, this.form.controls['password'].value).subscribe((response) => {
            this.loading = false;
            console.log(response)
            if("user_id" in response){
                this.router.navigate(['']);
            } else if(response['failure'] === "user_does_not_exist"){
                this.form.controls['login'].setErrors({
                    credentials: "Incorrect credentials"
                })
            } else if(response['failure'] === "invalid_password"){
                this.form.controls['password'].setErrors({
                    credentials: "Incorrect password"
                })
            }
        });
    }
}
