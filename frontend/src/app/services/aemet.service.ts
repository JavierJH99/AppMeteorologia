import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AemetService {
  constructor(public http: HttpClient) { }

  getMunicipios(){
    return this.http.get('http://localhost:3100/');
  }

  getPrediccion(codigoMunicipio:any){
    return this.http.post('http://localhost:3100/', {codigo: codigoMunicipio});
  }
}
