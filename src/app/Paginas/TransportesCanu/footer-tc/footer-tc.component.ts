import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-tc',
  imports: [],
  templateUrl: './footer-tc.component.html',
  styleUrl: './footer-tc.component.css'
})
export class FooterTcComponent {
anioActual: number = new Date().getFullYear();

}
