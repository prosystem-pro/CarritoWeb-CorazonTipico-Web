import { Component } from '@angular/core';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-tc',
  imports: [NabarSidebarComponent],
  templateUrl: './inicio-tc.component.html',
  styleUrl: './inicio-tc.component.css'
})
export class InicioTCComponent {
  constructor(private router: Router) { }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
