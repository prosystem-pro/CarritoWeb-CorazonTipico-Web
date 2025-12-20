import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginServicio } from '../Servicios/LoginServicio';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionRuta implements CanActivate {

  constructor(private loginServicio: LoginServicio, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const tokenValido = this.loginServicio.ValidarToken();

    if (tokenValido) {
      return true;
    } else {
      console.warn('❌ Token inválido, eliminando token y redirigiendo');

      this.loginServicio.EliminarToken();

      // Rutas especiales que deben ir a logintc
      const rutasLogintc = ['/viajes', '/mantenimiento','/iniciotc','/nabar-sidebar'];

      // state.url contiene la ruta a la que se intenta acceder
      if (rutasLogintc.some(ruta => state.url.includes(ruta))) {
        setTimeout(() => {
          this.router.navigate(['/logintc']);
        }, 0);
      } else {
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 0);
      }

      return false;
    }
  }

}
