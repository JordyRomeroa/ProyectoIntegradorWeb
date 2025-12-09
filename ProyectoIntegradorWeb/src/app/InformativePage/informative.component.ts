import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informative-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informative.component.html',
  styleUrls: ['./informative.component.css']
})
export class InformativeComponent {

  // =============================
  //   ESTADÍSTICAS
  // =============================
  stats = [
    { value: '50+', label: 'Proyectos Activos' },
    { value: '20+', label: 'Desarrolladores' },
    { value: '200+', label: 'Asesorías Realizadas' }
  ];

  // =============================
  //   EQUIPO
  // =============================
  team = [
    {
      name: 'María González',
      role: 'Lead Developer & Co-founder',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
      desc:
        'Experta en arquitectura de software y sistemas distribuidos. +10 años de experiencia como full-stack developer.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Technical Lead & Co-founder',
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
      desc:
        'Especialista en arquitectura cloud, DevOps y mentorías técnicas. Apasionado por el código limpio.'
    }
  ];

  // =============================
  //   PROYECTOS DESTACADOS
  // =============================
  projects = [
    {
      title: 'E-Commerce Platform',
      author: 'María González',
      desc:
        'Plataforma de comercio electrónico con Stripe, dashboard admin y analíticas.',
      tags: ['Next.js', 'TypeScript', 'Stripe']
    },
    {
      title: 'Task Management System',
      author: 'Carlos Rodríguez',
      desc:
        'Panel colaborativo con notificaciones, estadísticas y chat integrado.',
      tags: ['React', 'Node.js', 'Socket.io']
    },
    {
      title: 'AI Content Generator',
      author: 'María González',
      desc:
        'Generador inteligente de contenido utilizando OpenAI con FastAPI.',
      tags: ['Python', 'OpenAI', 'FastAPI']
    }
  ];

  // =============================
  //   MÉTODOS DEL COMPONENTE
  // =============================
  verProyecto(nombre: string) {
    console.log('Ver proyecto:', nombre);
  }

  solicitarAsesoria() {
    console.log('Solicitando asesoría…');
  }

  registrarProgramador() {
    console.log('Registrando programador…');
  }
}
