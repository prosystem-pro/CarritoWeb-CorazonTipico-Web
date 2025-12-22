import { Component } from '@angular/core';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";
import { Router } from '@angular/router';
import { FooterTcComponent } from '../footer-tc/footer-tc.component';


@Component({
  selector: 'app-inicio-tc',
  imports: [NabarSidebarComponent, FooterTcComponent],
  templateUrl: './inicio-tc.component.html',
  styleUrl: './inicio-tc.component.css'
})
export class InicioTCComponent {
  constructor(private router: Router) { }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
