import { Component, OnInit } from '@angular/core';
import { ViajesServicio } from '../../../Servicios/ViajesServicio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";

@Component({
  selector: 'app-reportes',
  imports: [FormsModule,CommonModule, NabarSidebarComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{
  reporte: any = null;
  anioActual = new Date().getFullYear();
  mesActual = new Date().getMonth() + 1;

  constructor(private viajesServicio: ViajesServicio) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.viajesServicio
      .ObtenerReporteMensual(this.anioActual, this.mesActual)
      .subscribe({
        next: (resp) => {
          this.reporte = resp.data;
        },
        error: (err) => {
          console.error('Error al cargar reporte', err);
        }
      });
  }
}
