import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { AdminSidebarComponent } from './sidebar/admin.sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent], // Incluir RouterModule en imports
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  // Este componente ahora actuará principalmente como un layout
  // para el sidebar y el contenido de las rutas hijas.
  // La lógica de gestión de usuarios se ha movido a los componentes hijos.
}
