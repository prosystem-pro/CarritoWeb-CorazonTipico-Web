import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ViajesServicio } from '../../../Servicios/ViajesServicio';
import { NabarSidebarComponent } from "../nabar-sidebar/nabar-sidebar.component";

@Component({
  selector: 'app-viajes',
  imports: [CommonModule, FormsModule, NabarSidebarComponent],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css']
})
export class ViajesComponent implements OnInit {

  /* ======================
     VARIABLES DE ORDEN Y ARRASTRE
  ====================== */
  mensajeEliminarVisible = false;
mensajeEliminarTexto = '';
private filaPendiente: HTMLElement | null = null; 
  ColumnaOrden: 'FechaViaje' | 'PrecioViaje' | '' = '';
  OrdenAscendente = true;
  Arrastrando = false;
  InicioX = 0;
  UmbralEliminar = 120;
  ViajeArrastrado: any = null;
  ElementoFila: HTMLElement | null = null;
  viajeParaEliminar: any = null;

  /* ======================
     DATOS
  ====================== */
  viajes: any[] = [];
  viajesFiltrados: any[] = [];

  viajeFormulario: any = {};
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

  constructor(private viajesServicio: ViajesServicio, private router: Router) { }

  ngOnInit(): void {
    this.Listado();
  }

  /* ======================
     FUNCIONES AUXILIARES
  ====================== */
  viajeVacio() {
    return {
      CodigoViaje: null,
      FechaViaje: '',
      Cliente: '',
      PrecioViaje: 0,
      PagoChofer: 0,
      PagoCombustible: 0,
      Imprevistos: 0,
      Estado: 2, // 1 Cancelado, 2 Agendado, 3 Pendiente
      DescripcionViaje: ''
    };
  }

  /* ======================
     LISTADO
  ====================== */
  Listado(): void {
    this.cargando = true;
    this.viajesServicio.Listado().subscribe({
      next: resp => {
        this.viajes = resp.data || [];
        this.viajesFiltrados = [...this.viajes];
        this.generarAnios();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  generarAnios() {
    this.anios = [...new Set(this.viajes.map(v => new Date(v.FechaViaje).getFullYear()))];
  }

  /* ======================
     FILTROS
  ====================== */
  Filtrar() {
    this.viajesFiltrados = this.viajes.filter(v => {
      const f = new Date(v.FechaViaje);
      return (!this.filtroAnio || f.getFullYear().toString() === this.filtroAnio) &&
        (!this.filtroMes || (f.getMonth() + 1).toString().padStart(2, '0') === this.filtroMes);
    });
  }

  LimpiarFiltros() {
    this.filtroAnio = '';
    this.filtroMes = '';
    this.viajesFiltrados = [...this.viajes];
  }

  /* ======================
     CREAR
  ====================== */
  MostrarFormularioCreacion() {
    this.viajeFormulario = this.viajeVacio();
    this.modoCreacion = true;
  }

  Crear() {
    this.viajesServicio.Crear(this.viajeFormulario).subscribe(() => {
      this.modoCreacion = false;
      this.Listado();
    });
  }

  /* ======================
     EDITAR
  ====================== */
  Editar(viaje: any) {
    this.viajeFormulario = { ...viaje };
    this.modoEdicion = true;
  }

  GuardarEdicion() {
    this.viajesServicio.Editar(this.viajeFormulario).subscribe(() => {
      this.modoEdicion = false;
      this.Listado();
    });
  }

  CancelarFormulario() {
    this.modoCreacion = false;
    this.modoEdicion = false;
    this.viajeFormulario = {};
  }

  RegresarInicio() {
    this.router.navigate(['/iniciotc']);
  }

  /* ======================
     ELIMINAR
  ====================== */
  Eliminar(id: number) {
    this.viajesServicio.Eliminar(id).subscribe(() => this.Listado());
  }

  onSwipeLeft(viaje: any) {
    if (confirm('¿Eliminar este viaje?')) {
      this.Eliminar(viaje.CodigoViaje);
    }
  }
  /* ======================
     ORDENAR COLUMNAS
  ====================== */
  OrdenarPor(columna: 'FechaViaje' | 'PrecioViaje') {
    if (this.ColumnaOrden === columna) {
      this.OrdenAscendente = !this.OrdenAscendente;
    } else {
      this.ColumnaOrden = columna;
      this.OrdenAscendente = true;
    }

    this.viajesFiltrados.sort((a, b) => {
      const A = columna === 'FechaViaje' ? new Date(a[columna]).getTime() : a[columna];
      const B = columna === 'FechaViaje' ? new Date(b[columna]).getTime() : b[columna];
      return this.OrdenAscendente ? A - B : B - A;
    });
  }
  /* ======================
     DESLIZAR FILAS
  ====================== */
  IniciarArrastre(event: any, viaje: any) {
    this.Arrastrando = true;
    this.ViajeArrastrado = viaje;
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
    // Guardamos la fila y el viaje para mostrar el mensaje
    this.filaPendiente = this.ElementoFila;
    this.MostrarMensajeEliminar(this.ViajeArrastrado);
  } else {
    this.ElementoFila.style.transform = 'translateX(0)';
    this.LimpiarArrastre();
  }
}

MostrarMensajeEliminar(viaje: any) {
  this.ViajeArrastrado = viaje;
  this.mensajeEliminarTexto = `¿Desea eliminar el viaje de ${viaje.Cliente}?`;
  this.mensajeEliminarVisible = true;
}

ConfirmarEliminar() {
  if (this.ViajeArrastrado) {
    this.Eliminar(this.ViajeArrastrado.CodigoViaje);
  }
  this.CerrarMensajeEliminar();
}

CancelarEliminar() {
  if (this.filaPendiente) {
    // Regresamos la fila a su posición original
    this.filaPendiente.style.transform = 'translateX(0)';
  }
  this.CerrarMensajeEliminar();
}

CerrarMensajeEliminar() {
  this.mensajeEliminarVisible = false;
  this.filaPendiente = null;
  this.ViajeArrastrado = null;
  this.Arrastrando = false;
  this.ElementoFila = null;
}

private LimpiarArrastre() {
  this.Arrastrando = false;
  this.ViajeArrastrado = null;
  this.ElementoFila = null;
}
}
