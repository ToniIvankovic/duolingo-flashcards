import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private loginURI = '/api/login';

    constructor(private readonly http: HttpClient) {}

    public login(username: string, password: string): Observable<IUser | null> {
        return (
            this.http.post(
                this.loginURI,
                {
                    login: username,
                    password: password,
                },
                {
                    observe: 'response',
                    responseType: 'json',
                    withCredentials: true,
                }
            ) as Observable<HttpResponse<{response: string, user_id: string, username: string} | null>>
        ).pipe(
            map((response) => response.body),
            tap((body) => {
                if(body?.response === "OK"){
                    document.cookie = `username=${body!.username}`;
                    document.cookie = `user_id=${body!.user_id}`;
                }
            })
        );
        // request.subscribe((response) => {
        //     this.http.get(
        //         `/api/users/${response.body?.username}`,
        //     ).subscribe(console.log);
        // });
    }

    public getCurrentUser(): IUser | null {
        if (!document.cookie) {
            return null;
        }
        // TODO provjera jwt

        const cookieParts = document.cookie.split('; ');
        let user_id = '';
        let username = '';
        for (let cookiePart of cookieParts) {
            if (cookiePart.startsWith('user_id')) {
                user_id = cookiePart.split('=')[1];
            } else if (cookiePart.startsWith('username')) {
                username = cookiePart.split('=')[1];
            }
        }
        if (user_id === '' || username === '') {
            return null;
        }
        return {
            user_id,
            username,
        };
    }

    public logout(): void {
        for (let cookie of document.cookie.split('; ')) {
            let cookieParts = cookie.split('=');
            let name = cookieParts[0];
            document.cookie =
                name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
}
