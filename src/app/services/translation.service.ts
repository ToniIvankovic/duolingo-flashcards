import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleObj } from '../interfaces/google_obj.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    url = 'https://translation.googleapis.com/language/translate/v2?key=';
    key = environment.private_key;
    constructor(private http: HttpClient) {}
    
    translate(obj: GoogleObj) {
        return this.http.post(this.url + this.key, obj, {
            // headers: { Authorization: `Bearer  ${this.key}` },
        });
    }
}
