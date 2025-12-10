import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { ProgrammerPortfolioComponent } from './dashboard/programmer-portfolio/programmer-portfolio.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';
import { InformativeComponent } from './InformativePage/informative.component';

export const routes: Routes = [
  { path: 'Informative', component: InformativeComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard], data: { role: 'admin' } },
  { path: 'programmer', component: ProgrammerPortfolioComponent, canActivate: [roleGuard], data: { role: 'programmer' } },
  { path: 'user', component: UserDashboardComponent, canActivate: [roleGuard], data: { role: 'user' } },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'login', component: LoginComponent }, // Added login route
  { path: '', redirectTo: '/Informative', pathMatch: 'full' },
  { path: '**', redirectTo: '/informative' } // Wildcard route for any unmatched URLs

];
