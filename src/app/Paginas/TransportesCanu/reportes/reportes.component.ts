import { Component, OnInit } from '@angular/core';
import { ViajesServicio } from '../../../Servicios/ViajesServicio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";
import { Router } from '@angular/router';
import { LoginServicio } from '../../../Servicios/LoginServicio';

@Component({
  selector: 'app-reportes',
  imports: [FormsModule, CommonModule, NabarSidebarComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  codigoUsuario: number | null = null;
  reporte: any = null;

  filtroAnio: number | '' = '';
  filtroMes: string = '';

  anios: number[] = [];
  meses = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' }
  ];

  nombreMesSeleccionado = '';

  constructor(
    private viajesServicio: ViajesServicio,
    private router: Router,
    private loginServicio: LoginServicio
  ) { }

  ngOnInit(): void {
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const mesActual = (hoy.getMonth() + 1).toString().padStart(2, '0');

    // 🔐 OBTENER CODIGO USUARIO
    this.codigoUsuario = this.loginServicio.ObtenerCodigoUsuario();

    if (!this.codigoUsuario) {
      this.router.navigate(['/logintc']);
      return;
    }

    this.anios = [
      anioActual + 1,
      anioActual,
      anioActual - 1,
      anioActual - 2
    ];

    this.filtroAnio = anioActual;
    this.filtroMes = mesActual;

    this.actualizarNombreMes();
    this.cargarReporte();
  }


  GenerarLinea(data: number[]): string {
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
    return points;
  }

  Filtrar(): void {
    // Solo buscar si hay año y mes
    if (!this.filtroAnio || !this.filtroMes) {
      this.reporte = null;
      return;
    }

    this.actualizarNombreMes();
    this.cargarReporte();
  }

  actualizarNombreMes(): void {
    const mes = this.meses.find(m => m.value === this.filtroMes);
    this.nombreMesSeleccionado = mes ? mes.name : '';
  }

  cargarReporte(): void {
    if (!this.codigoUsuario) return;

    this.reporte = null;

    this.viajesServicio
      .ObtenerReporteMensual(
        this.filtroAnio as number,
        Number(this.filtroMes),
        this.codigoUsuario
      )
      .subscribe({
        next: resp => {
          this.reporte = resp.data;
        },
        error: err => {
          console.error('Error al cargar reporte', err);
        }
      });
  }

  RegresarInicio() {
    this.router.navigate(['/iniciotc']);
  }
}
