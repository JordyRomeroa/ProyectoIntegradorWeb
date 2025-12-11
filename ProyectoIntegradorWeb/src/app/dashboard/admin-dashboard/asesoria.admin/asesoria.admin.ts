import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../sidebar/admin.sidebar.component';

interface Asesoria {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
}

@Component({
  standalone: true,
  selector: 'admin-asesorias',
  templateUrl: './asesoria.admin.html',
  styleUrls: ['./asesoria.admin.css'],
  imports: [CommonModule,AdminSidebarComponent]
})
export class AsesoriaAdminComponent {

  // Datos de ejemplo: reemplazar luego por Firestore
  asesorias: Asesoria[] = [
    {
      id: '1',
      nombre: 'Carlos Pérez',
      email: 'carlos@example.com',
      mensaje: 'Necesito ayuda con mi proyecto web.'
    },
    {
      id: '2',
      nombre: 'María Gómez',
      email: 'maria@example.com',
      mensaje: 'Quiero una asesoría sobre bases de datos.'
    }
  ];

  aceptar(id: string) {
    console.log("Aceptar solicitud", id);
    alert("Solicitud aceptada");
  }

  rechazar(id: string) {
    console.log("Rechazar solicitud", id);
    alert("Solicitud rechazada");
  }
  
}
