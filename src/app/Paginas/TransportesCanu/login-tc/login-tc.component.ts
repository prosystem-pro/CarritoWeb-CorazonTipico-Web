import { Component } from '@angular/core';
import { LoginServicio } from '../../../Servicios/LoginServicio';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-tc',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-tc.component.html',
  styleUrl: './login-tc.component.css'
})
export class LoginTCComponent {
 nombreUsuario: string = '';
  clave: string = '';
  errorLogin: boolean = false;

  constructor(private loginServicio: LoginServicio, private router: Router) {}

  IniciarSesion(): void {
    this.errorLogin = false; // reset error

    if (!this.nombreUsuario || !this.clave) {
      this.errorLogin = true;
      return;
    }

    this.loginServicio.Login(this.nombreUsuario, this.clave).subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data?.Token) {
          // Login exitoso, redirige a la página principal
          this.router.navigate(['/iniciotc']);
        } else {
          // Login fallido
          this.errorLogin = true;
        }
      },
      error: (err) => {
        console.error('Error de login', err);
        this.errorLogin = true;
      }
    });
  }
}
