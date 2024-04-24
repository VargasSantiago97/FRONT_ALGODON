import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComunicacionService {

    API_URI = 'http://localhost:3000'

    constructor(
        private http: HttpClient,
    ) { }

    apiGet(tabla:string) {
        return this.http.get(`${this.API_URI}/api/${tabla}`);
    }
    apiGetId(tabla:string, idd:any) {
        return this.http.get(`${this.API_URI}/api/${tabla}/${idd}`);
    }
}
