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


    apiGet(tabla:string, idd:any = "") {
        return this.http.get(`${this.API_URI}/api/${tabla}/${idd}`);
    }
    apiPost(tabla:string, datos:any) {
        return this.http.post(`${this.API_URI}/api/${tabla}`, datos);
    }
    apiUpdate(tabla:string, datos:any) {
        return this.http.put(`${this.API_URI}/api/${tabla}/${datos._id}`, datos);
    }
    apiDelete(tabla:string, idd:string) {
        return this.http.delete(`${this.API_URI}/api/${tabla}/${idd}`);
    }
}
