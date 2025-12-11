import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgrammerSidebarComponent } from './sidebar/programmer-sidebar.component'; // Importar el sidebar del programador

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgrammerSidebarComponent], // Añadir ProgrammerSidebarComponent
  templateUrl: './programmer-dashboard.component.html',
  styleUrls: ['./programmer-dashboard.component.css']
})
export class ProgrammerDashboardComponent {

}
