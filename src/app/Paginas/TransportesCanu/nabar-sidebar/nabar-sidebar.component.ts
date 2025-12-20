import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServicio } from '../../../Servicios/LoginServicio';

@Component({
  selector: 'app-nabar-sidebar',
  templateUrl: './nabar-sidebar.component.html',
  styleUrls: ['./nabar-sidebar.component.css']
})
export class NabarSidebarComponent {
  sidebarVisible: boolean = false;

  constructor(private router: Router, private loginServicio: LoginServicio) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
    this.sidebarVisible = false; // cierra el sidebar al navegar
  }

  toggleSidebar(): void {
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
      this.sidebarVisible = !this.sidebarVisible;
    }
  }
    CerrarSesion(ruta: string) {
    if (ruta === 'salir') {
      // Cerrar sesión
      this.loginServicio.EliminarToken();
      this.loginServicio.EliminarUsuario();
      // Redirigir al login
      this.router.navigate(['/logintc']);
    } else {
      // Navegar normalmente
      this.router.navigate([ruta]);
    }
    this.sidebarVisible = false; // cerrar sidebar al navegar
  }
}
