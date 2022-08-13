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

    constructor(private readonly authService: AuthService, private readonly router :Router) {
        this.form = new FormGroup({
            login: new FormControl(''),
            password: new FormControl(''),
        });
    }

    ngOnInit(): void {}

    public onLoginClick(event: Event) {
        event.preventDefault();
        this.authService.login(this.form.controls['login'].value, this.form.controls['password'].value).subscribe((user) => {
            if(user){
                this.router.navigate(['']);
            } else{
                this.form.controls['password'].setErrors({
                    credentials: "Incorrect credentials"
                })
            }
        });
    }
}
