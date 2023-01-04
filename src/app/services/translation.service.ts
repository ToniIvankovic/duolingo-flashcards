import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { GoogleObj } from '../interfaces/google_obj.interface';
import { TranslationResponse } from '../interfaces/google_obj.interface';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    url = 'https://translation.googleapis.com/language/translate/v2?key=';
    private key: Observable<string> = this.http
        .get('key.json')
        .pipe(map((res: any) => res.key));

    constructor(private http: HttpClient) {}

    translate(obj: GoogleObj) {
        return this.key.pipe(
            switchMap((key) => {
                return this.http.post<TranslationResponse>(
                    this.url + this.key,
                    obj
                );
            })
        );
    }
}
