import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';
import { ExternalUserGuard } from './guards/external-user.guard';

import { InformativeComponent } from './InformativePage/informative.component';
import { ContactoComponent } from './InformativePage/contacto/contacto.component';
import { EquipoComponent } from './InformativePage/equipo/equipo.component';
import { ProyectosComponent } from './InformativePage/proyectos/proyectos.component';
import { AsesoriaComponent } from './InformativePage/asesorias/asesoria.component';

import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AdminProgrammerManagementListComponent } from './dashboard/admin-dashboard/programmer-management-list/programmer-management-list.component';
import { AdminProgrammerFormComponent } from './dashboard/admin-dashboard/programmer-form/programmer-form.component';
import { AsesoriaAdminComponent } from './dashboard/admin-dashboard/asesoria.admin/asesoria.admin';
import { AdminPerfilComponent } from './dashboard/admin-dashboard/admin.perfil/admin.perfil';
import { AdminPortafolioComponent } from './dashboard/admin-dashboard/admin.portafolio/admin.portafolio';

import { ProgrammerDashboardComponent } from './dashboard/programmer-dashboard/programmer-dashboard.component'; // Nuevo componente para el dashboard de programador
import { ProgrammerPortfolioComponent } from './dashboard/programmer-portfolio/programmer-portfolio.component';
import { ProgrammerAsesoriasComponent } from './dashboard/programmer-dashboard/programmer-asesorias/programmer-asesorias.component'; // Nuevo componente para asesorías del programador

import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component'; // Nuevo componente para el dashboard de usuario
import { PortfolioListComponent } from './dashboard/user-dashboard/portfolio-list/portfolio-list.component';
import { PortfolioDetailComponent } from './dashboard/user-dashboard/portfolio-detail/portfolio-detail.component';
import { SolicitarAsesoriaComponent } from './dashboard/user-dashboard/solicitar-asesoria/solicitar-asesoria.component';

export const routes: Routes = [
  // Rutas públicas (Informative Page)
  { path: '', redirectTo: '/informative', pathMatch: 'full' },
  { path: 'informative', component: InformativeComponent,
    children: [
      { path: 'contacto', component: ContactoComponent },
      { path: 'equipo', component: EquipoComponent },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'asesoria', component: AsesoriaComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Rutas del Administrador
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard], data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'programmers', pathMatch: 'full' },
      { path: 'programmers', component: AdminProgrammerManagementListComponent },
      { path: 'programmers/new', component: AdminProgrammerFormComponent },
      { path: 'programmers/edit/:id', component: AdminProgrammerFormComponent },
      { path: 'asesorias', component: AsesoriaAdminComponent },
      { path: 'perfil', component: AdminPerfilComponent },
      { path: 'portafolio', component: AdminPortafolioComponent },
    ],
  },

  // Rutas del Programador
  { path: 'programmer', component: ProgrammerDashboardComponent, canActivate: [roleGuard], data: { role: 'programmer' },
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
      { path: 'portfolio', component: ProgrammerPortfolioComponent },
      { path: 'asesorias', component: ProgrammerAsesoriasComponent },
      // Rutas para gestión de proyectos del programador aquí
    ],
  },

  // Rutas del Usuario Normal
  { path: 'user', component: UserDashboardComponent, canActivate: [ExternalUserGuard], // Asumo que ExternalUserGuard es para usuarios no logueados o con rol 'user'
    children: [
      { path: '', redirectTo: 'explorar', pathMatch: 'full' },
      { path: 'explorar', component: PortfolioListComponent },
      { path: 'portafolio/:id', component: PortfolioDetailComponent },
      { path: 'asesoria/:idProgramador', component: SolicitarAsesoriaComponent },
    ],
  },

  // Wildcard route for any other path
  { path: '**', redirectTo: '/informative' },
];
