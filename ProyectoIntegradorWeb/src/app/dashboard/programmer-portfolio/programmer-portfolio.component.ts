import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.interface';
import { ProjectModalComponent } from '../../pages/programador/project-modal/project-modal.component';
import { Observable } from 'rxjs';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe'; // Importar el pipe

@Component({
  selector: 'app-programmer-portfolio',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent, ReplaceSpacePipe],
  templateUrl: './programmer-portfolio.component.html',
  styleUrls: ['./programmer-portfolio.component.css']
})
export class ProgrammerPortfolioComponent implements OnInit {
  projects$!: Observable<Project[]>;
  isModalOpen: boolean = false;
  selectedProject: Project | null = null;

  constructor(private projectService: ProjectService, private authService: AuthService) { }

  ngOnInit(): void {
    this.projects$ = this.projectService.getProjectsByUser();
  }

  openCreateProjectModal(): void {
    this.selectedProject = null;
    this.isModalOpen = true;
  }

  openEditProjectModal(project: Project): void {
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  async handleSaveProject(project: Project): Promise<void> {
    try {
      if (project.id) {
        await this.projectService.updateProject(project.id, project);
      } else {
        // El UID será añadido automáticamente por el servicio
        await this.projectService.createProject(project);
      }
      this.closeModal();
      // Opcional: recargar los proyectos o actualizar el observable
      this.projects$ = this.projectService.getProjectsByUser(); // Recargar proyectos
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }

  async handleDeleteProject(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await this.projectService.deleteProject(id);
        // Opcional: recargar los proyectos o actualizar el observable
        this.projects$ = this.projectService.getProjectsByUser(); // Recargar proyectos
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
  }
}
