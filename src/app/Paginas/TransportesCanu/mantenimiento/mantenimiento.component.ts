import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MantenimientoServicio } from '../../../Servicios/MantenimientoServicio';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";

@Component({
  selector: 'app-mantenimiento',
  imports: [CommonModule, FormsModule, NabarSidebarComponent],
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  /* ======================
     VARIABLES DE ORDEN Y ARRASTRE
  ====================== */
  ColumnaOrden: 'FechaMantenimiento' | 'ManoObra' | '' = '';
  OrdenAscendente = true;
  Arrastrando = false;
  InicioX = 0;
  UmbralEliminar = 120;
  MantenimientoArrastrado: any = null;
  ElementoFila: HTMLElement | null = null;

  mensajeEliminarVisible = false;
  mensajeEliminarTexto = '';
  MantenimientoEliminar: any = null;

  /* ======================
     DATOS
  ====================== */
  mantenimientos: any[] = [];
  mantenimientosFiltrados: any[] = [];

  mantenimientoFormulario: any = {};
  cargando = false;

  modoCreacion = false;
  modoEdicion = false;

  filtroAnio = '';
  filtroMes = '';

  anios: number[] = [];
  meses = [
    { value: '01', name: 'Enero' }, { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' }, { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' }, { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' }, { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' }, { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' }, { value: '12', name: 'Diciembre' }
  ];

  constructor(private mantenimientoServicio: MantenimientoServicio, private router: Router) { }

  ngOnInit(): void {
    this.Listado();
  }

  /* ======================
     FUNCIONES AUXILIARES
  ====================== */
  mantenimientoVacio() {
    return {
      CodigoMantenimiento: null,
      FechaMantenimiento: '',
      Responsable: '',
      ManoObra: 0,
      CostoRepuestos: 0,
      Imprevistos: 0,
      Estado: 1, // 1 Activo, 2 En proceso, 3 Finalizado (ejemplo)
      DescripcionMantenimiento: ''
    };
  }

  /* ======================
     LISTADO
  ====================== */
  Listado(): void {
    this.cargando = true;
    this.mantenimientoServicio.Listado().subscribe({
      next: resp => {
        this.mantenimientos = resp.data || [];
        this.mantenimientosFiltrados = [...this.mantenimientos];
        this.generarAnios();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  generarAnios() {
    this.anios = [...new Set(this.mantenimientos.map(m => new Date(m.FechaMantenimiento).getFullYear()))];
  }

  /* ======================
     FILTROS
  ====================== */
  Filtrar() {
    this.mantenimientosFiltrados = this.mantenimientos.filter(m => {
      const f = new Date(m.FechaMantenimiento);
      return (!this.filtroAnio || f.getFullYear().toString() === this.filtroAnio) &&
        (!this.filtroMes || (f.getMonth() + 1).toString().padStart(2, '0') === this.filtroMes);
    });
  }

  LimpiarFiltros() {
    this.filtroAnio = '';
    this.filtroMes = '';
    this.mantenimientosFiltrados = [...this.mantenimientos];
  }

  /* ======================
     CREAR
  ====================== */
  MostrarFormularioCreacion() {
    this.mantenimientoFormulario = this.mantenimientoVacio();
    this.modoCreacion = true;
  }

  Crear() {
    this.mantenimientoServicio.Crear(this.mantenimientoFormulario).subscribe(() => {
      this.modoCreacion = false;
      this.Listado();
    });
  }

  /* ======================
     EDITAR
  ====================== */
  Editar(mantenimiento: any) {
    this.mantenimientoFormulario = { ...mantenimiento };
    this.modoEdicion = true;
  }

  GuardarEdicion() {
    this.mantenimientoServicio.Editar(this.mantenimientoFormulario).subscribe(() => {
      this.modoEdicion = false;
      this.Listado();
    });
  }

  CancelarFormulario() {
    this.modoCreacion = false;
    this.modoEdicion = false;
    this.mantenimientoFormulario = {};
  }

  RegresarInicio() {
    this.router.navigate(['/iniciotc']);
  }

  /* ======================
     ELIMINAR
  ====================== */
  Eliminar(id: number) {
    this.mantenimientoServicio.Eliminar(id).subscribe(() => this.Listado());
  }

  onSwipeLeft(mantenimiento: any) {
    if (confirm('¿Eliminar este mantenimiento?')) {
      this.Eliminar(mantenimiento.CodigoMantenimiento);
    }
  }

  /* ======================
     DESLIZAR FILAS
  ====================== */
  IniciarArrastre(event: any, mantenimiento: any) {
    this.Arrastrando = true;
    this.MantenimientoArrastrado = mantenimiento;
    this.InicioX = event.touches ? event.touches[0].clientX : event.clientX;

    const fila = event.currentTarget as HTMLElement;
    this.ElementoFila = fila.querySelector('.fila-contenido');
    fila.classList.add('activa');
  }

  DuranteArrastre(event: any) {
    if (!this.Arrastrando || !this.ElementoFila) return;
    const xActual = event.touches ? event.touches[0].clientX : event.clientX;
    const desplazamiento = Math.max(0, xActual - this.InicioX);
    this.ElementoFila.style.transform = `translateX(${desplazamiento}px)`;
  }

  FinalizarArrastre() {
    if (!this.Arrastrando || !this.ElementoFila) return;

    const desplazamiento = parseInt(this.ElementoFila.style.transform.replace('translateX(', '')) || 0;
    const fila = this.ElementoFila.parentElement?.parentElement;
    fila?.classList.remove('activa');

    if (desplazamiento > this.UmbralEliminar) {
      // Mostrar modal Bootstrap y mantener referencia para restaurar
      this.MostrarMensajeEliminar(this.MantenimientoArrastrado, '¿Eliminar este mantenimiento?');
      // No resetear aún ElementoFila ni MantenimientoArrastrado
    } else {
      // Si no pasó el umbral, regresamos la fila a su lugar y reseteamos
      this.ElementoFila.style.transform = 'translateX(0)';
      this.LimpiarArrastre();
    }

    this.Arrastrando = false;
  }
  LimpiarArrastre() {
    this.ElementoFila = null;
    this.MantenimientoArrastrado = null;
  }

  MostrarMensajeEliminar(mantenimiento: any, texto: string) {
    this.MantenimientoEliminar = mantenimiento;
    this.mensajeEliminarTexto = texto;
    this.mensajeEliminarVisible = true;
  }

  ConfirmarEliminar() {
    if (this.MantenimientoEliminar) {
      this.Eliminar(this.MantenimientoEliminar.CodigoMantenimiento);
    }
    this.CerrarModalEliminar();
  }

  CancelarEliminar() {
    if (this.ElementoFila) {
      this.ElementoFila.style.transform = 'translateX(0)'; // regresa la fila a su posición
    }
    this.CerrarModalEliminar();
    this.LimpiarArrastre(); // limpiar referencias
  }


  CerrarModalEliminar() {
    this.mensajeEliminarVisible = false;
    this.MantenimientoEliminar = null;
    this.mensajeEliminarTexto = '';
  }

  /* ======================
     ORDENAR COLUMNAS
  ====================== */
  OrdenarPor(columna: 'FechaMantenimiento' | 'ManoObra') {
    if (this.ColumnaOrden === columna) {
      this.OrdenAscendente = !this.OrdenAscendente;
    } else {
      this.ColumnaOrden = columna;
      this.OrdenAscendente = true;
    }

    this.mantenimientosFiltrados.sort((a, b) => {
      const A = columna === 'FechaMantenimiento' ? new Date(a[columna]).getTime() : a[columna];
      const B = columna === 'FechaMantenimiento' ? new Date(b[columna]).getTime() : b[columna];
      return this.OrdenAscendente ? A - B : B - A;
    });
  }
}
