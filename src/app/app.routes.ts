import { Routes } from '@angular/router';
import { AutorizacionRuta } from './Autorizacion/AutorizacionRuta';
import { LoginComponent } from '../app/Paginas/Autorizacion/login/login.component';
import { NosotrosComponent } from './Paginas/Inicio/nosotros/nosotros.component';
import { MenuCategoriaComponent } from './Paginas/Inicio/menu/menuCategoria.component';
import { ProductosComponent } from './Componentes/productos/productos.component';
import { ContactoComponent } from './Paginas/Inicio/contacto/contacto.component';
import { OtroComponent } from './Paginas/Inicio/otro/otro.component';
import { ReporteProductoComponent } from './Paginas/Inicio/reporte-producto/reporte-producto.component';
import { HeaderReporteComponent } from './Componentes/header-reporte/header-reporte.component';
import { ReporteVistaComponent } from './Paginas/Inicio/reporte-vista/reporte-vista.component';
import { ReporteRedSocialComponent } from './Paginas/Inicio/reporte-red-social/reporte-red-social.component';
import { ReporteTiempoPaginaComponent } from './Paginas/Inicio/reporte-tiempo-pagina/reporte-tiempo-pagina.component';
import { PagoComponent } from './Paginas/Inicio/pago/pago.component';
import { LoginGuard } from './Servicios/loginGuard';
import { SpinnerGlobalComponent } from './Componentes/spinner-global/spinner-global.component';

//TRANSPORTES CANU
import { ViajesComponent } from './Paginas/TransportesCanu/viajes/viajes.component';
import { NabarSidebarComponent } from './Paginas/TransportesCanu/nabar-sidebar/nabar-sidebar.component';
import { InicioTCComponent } from './Paginas/TransportesCanu/inicio-tc/inicio-tc.component';
import { MantenimientoComponent } from './Paginas/TransportesCanu/mantenimiento/mantenimiento.component';
import { LoginTCComponent } from './Paginas/TransportesCanu/login-tc/login-tc.component';
import { ReportesComponent } from './Paginas/TransportesCanu/reportes/reportes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/nosotros', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

  //Rutas publicas
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'clasificacion', component: MenuCategoriaComponent },
  { path: 'productos/:codigo/:nombre', component: ProductosComponent },
  { path: 'productos/buscar', component: ProductosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'otro', component: OtroComponent },
  { path: 'spinner-global', component: SpinnerGlobalComponent },

  //Rutas protegidas
  { path: 'reporte-producto', component: ReporteProductoComponent, canActivate: [AutorizacionRuta] },
  { path: 'header-reporte', component: HeaderReporteComponent, canActivate: [AutorizacionRuta] },
  { path: 'reporte-vista', component: ReporteVistaComponent, canActivate: [AutorizacionRuta] },
  { path: 'reporte-red-social', component: ReporteRedSocialComponent, canActivate: [AutorizacionRuta] },
  { path: 'reporte-tiempo-pagina', component: ReporteTiempoPaginaComponent, canActivate: [AutorizacionRuta] },
  { path: 'pago', component: PagoComponent, canActivate: [AutorizacionRuta] },
  //Transportes Canu
  { path: 'navbarsidebar', component: NabarSidebarComponent, canActivate: [AutorizacionRuta] },
  { path: 'viajes', component: ViajesComponent, canActivate: [AutorizacionRuta] },
  { path: 'iniciotc', component: InicioTCComponent, canActivate: [AutorizacionRuta] },
  { path: 'mantenimiento', component: MantenimientoComponent, canActivate: [AutorizacionRuta] },
  { path: 'reportes', component: ReportesComponent, canActivate: [AutorizacionRuta] },
  { path: 'logintc', component: LoginTCComponent },

  { path: '**', redirectTo: 'nosotros' },
];
