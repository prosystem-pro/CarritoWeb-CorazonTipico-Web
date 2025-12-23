import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entorno } from '../Entornos/Entorno';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoServicio {

  private Url = `${Entorno.ApiUrl}mantenimiento`;

  constructor(private http: HttpClient) { }

  Listado(codigoUsuario: number): Observable<any> {
    return this.http.get(`${this.Url}/listado`, {
      params: { CodigoUsuario: codigoUsuario }
    });
  }


  Crear(Datos: any): Observable<any> {
    return this.http.post(`${this.Url}/crear`, Datos);
  }

  ObtenerPorCodigo(Codigo: string): Observable<any> {
    return this.http.get(`${this.Url}/${Codigo}`);
  }

  Editar(Datos: any): Observable<any> {
    return this.http.put(`${this.Url}/editar/${Datos.CodigoMantenimiento}`, Datos);
  }

  Eliminar(Codigo: number): Observable<any> {
    return this.http.delete(`${this.Url}/eliminar/${Codigo}`);
  }

}
