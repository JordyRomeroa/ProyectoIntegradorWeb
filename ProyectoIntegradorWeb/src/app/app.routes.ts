import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { ProgrammerPortfolioComponent } from './dashboard/programmer-portfolio/programmer-portfolio.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';

import { ContactoComponent } from './InformativePage/contacto/contacto.component';
import { EquipoComponent } from './InformativePage/equipo/equipo.component';
import { ProyectosComponent } from './InformativePage/proyectos/proyectos.component';
import { InformativeComponent } from './InformativePage/informative.component';
import { AsesoriaComponent } from './InformativePage/asesorias/asesoria.component';

export const routes: Routes = [
  { path: 'informative', component: InformativeComponent },
  {path: 'Login', component: LoginComponent},
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard], data: { role: 'admin' } },
  { path: 'programmer', component: ProgrammerPortfolioComponent, canActivate: [roleGuard], data: { role: 'programmer' } },
  { path: 'user', component: UserDashboardComponent, canActivate: [roleGuard], data: { role: 'user' } },
  { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'login', component: LoginComponent }, // Added login route
  { path: '', redirectTo: '/informative', pathMatch: 'full' },
   // Wildcard route for any unmatched URLs
  {path: 'Contacto', component: ContactoComponent},
  {path: 'Equipo', component: EquipoComponent},

  //no se por que no redirecciona a proyectos//
  {path: 'proyectos', component: ProyectosComponent},
  { path: 'asesoria', component: AsesoriaComponent },
  { path: '**', redirectTo: '/informative' }
];
