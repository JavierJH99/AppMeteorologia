import { Component, Input } from '@angular/core';
import { AemetService } from 'src/app/services/aemet.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent{
  title = 'frontend';
  municipiosJSON: any;
  municipios: Municipio[] = [];

  myControl = new FormControl();
  filteredOptions: Observable<Municipio[]>;

  prediccionJSON: any;
  prediccion: any;
  prediccionLista: boolean = false;

  constructor(private aemetService: AemetService) {
    this.aemetService.getMunicipios()
    .subscribe(
      result => {
          this.municipiosJSON = result;
          for(let i = 0; i < this.municipiosJSON.length; i++){
            this.municipios.push(
              new Municipio(this.municipiosJSON[i]["nombre"],
              (this.municipiosJSON[i]["id"]).substring(2))
            );
          }
        }
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.municipios.slice())),
    );
  }

  displayFn(municipio: Municipio) : string{
    return municipio.nombre;
  }

  municipioSelec(municipio: Municipio){
    this.aemetService.getPrediccion(municipio.codigo).subscribe(
      result => {
        this.prediccionJSON = result;
        this.prediccion = new Prediccion(
          municipio.nombre,
          new Date(this.prediccionJSON.fecha),
          this.prediccionJSON.temperatura.maxima,
          this.prediccionJSON.temperatura.minima,
          this.prediccionJSON.probPrecipitacion
        );
        this.prediccionLista = true;
        console.log(this.prediccion);
      }
    );
  }

  private _filter(name: string): Municipio[] {
    const filterValue = name.toLowerCase();
    return this.municipios.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
}

class Municipio{
  nombre:string;
  codigo:string;

  constructor(n:string, c:string){
    this.nombre = n;
    this.codigo = c;
  }
}

class Prediccion{
  municipio:string;
  fecha:string;
  temperaturaMedia:number;
  probPrecipitacion:number[];

  constructor(m:string, f:Date, tMax:number, tMin:number,prob:number[]){
    this.municipio = m;
    this.fecha = '' + this.diaSemana(f.getDay()) + ', ' + f.getUTCDate() + ' de ' + this.nombreMes(f.getMonth()) + ' de ' + f.getFullYear();
    this.temperaturaMedia = Math.round(tMax/tMin);
    this.probPrecipitacion = prob;
  }

  diaSemana(dia:number):string{
    switch(dia){
      case 0:
        return 'Lunes';
        break;
      case 1:
        return 'Martes';
        break;
      case 2:
        return 'Miércoles';
        break;
      case 3:
        return 'Jueves';
        break;
      case 4:
        return 'Viernes';
        break;
      case 5:
        return 'Sábado';
        break;
      case 6:
        return 'Domingo';
        break;
      default:
        return '';
        break;
    }
  }

  nombreMes(mes:number):string{
    switch(mes){
      case 0:
        return 'Enero';
        break;
      case 1:
        return 'Febrero';
        break;
      case 2:
        return 'Marzo';
        break;
      case 3:
        return 'Abril';
        break;
      case 4:
        return 'Mayo';
        break;
      case 5:
        return 'Junio';
        break;
      case 6:
        return 'Julio';
        break;
      case 7:
        return 'Agosto';
        break;
      case 8:
        return 'Septiembre';
        break;
      case 9:
        return 'Octubre';
        break;
      case 10:
        return 'Noviembre';
        break;
      case 11:
        return 'Diciembre';
        break;
      default:
        return '';
        break;
    }
  }
}