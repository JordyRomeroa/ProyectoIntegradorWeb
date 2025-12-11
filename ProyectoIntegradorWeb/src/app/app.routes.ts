import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { ProgrammerPortfolioComponent } from './dashboard/programmer-portfolio/programmer-portfolio.component';
// import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component'; // No se usará directamente como ruta base
import { PortfolioListComponent } from './dashboard/user-dashboard/portfolio-list/portfolio-list.component';
import { PortfolioDetailComponent } from './dashboard/user-dashboard/portfolio-detail/portfolio-detail.component';
import { SolicitarAsesoriaComponent } from './dashboard/user-dashboard/solicitar-asesoria/solicitar-asesoria.component';
import { ProgrammerManagementListComponent } from './dashboard/admin-dashboard/programmer-management-list/programmer-management-list.component'; // Nueva importación
import { ProgrammerFormComponent } from './dashboard/admin-dashboard/programmer-form/programmer-form.component'; // Nueva importación
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';
import { ExternalUserGuard } from './guards/external-user.guard';

import { ContactoComponent } from './InformativePage/contacto/contacto.component';
import { EquipoComponent } from './InformativePage/equipo/equipo.component';
import { ProyectosComponent } from './InformativePage/proyectos/proyectos.component';
import { InformativeComponent } from './InformativePage/informative.component';
import { AsesoriaComponent } from './InformativePage/asesorias/asesoria.component';

export const routes: Routes = [
  { path: 'informative', component: InformativeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard], data: { role: 'admin' }, children: [
    { path: 'programmers', component: ProgrammerManagementListComponent, canActivate: [roleGuard], data: { role: 'admin' } },
    { path: 'programmers/new', component: ProgrammerFormComponent, canActivate: [roleGuard], data: { role: 'admin' } },
    { path: 'programmers/edit/:id', component: ProgrammerFormComponent, canActivate: [roleGuard], data: { role: 'admin' } },
  ]},
  { path: 'programmer', component: ProgrammerPortfolioComponent, canActivate: [roleGuard], data: { role: 'programmer' } },
  { path: 'user', redirectTo: '/explorar', pathMatch: 'full' }, // Redirige el dashboard de usuario a la lista de portafolios
  { path: 'explorar', component: PortfolioListComponent, canActivate: [ExternalUserGuard] },
  { path: 'portafolio/:id', component: PortfolioDetailComponent, canActivate: [ExternalUserGuard] },
  { path: 'asesoria/:idProgramador', component: SolicitarAsesoriaComponent, canActivate: [ExternalUserGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/informative', pathMatch: 'full' },
  { path: 'Contacto', component: ContactoComponent },
  { path: 'Equipo', component: EquipoComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'asesoria', component: AsesoriaComponent },
  { path: '**', redirectTo: '/informative' }
];
