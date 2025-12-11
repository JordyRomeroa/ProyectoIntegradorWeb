import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.interface';
import { ProjectModalComponent } from '../../pages/programador/project-modal/project-modal.component';
import { Observable, of } from 'rxjs'; // Importar 'of'
import { switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { User } from '@angular/fire/auth'; // Importar User

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
  currentProgrammerId: string | null = null; // Para almacenar el UID del programador actual

  constructor(private projectService: ProjectService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.pipe(
      switchMap((user: User | null) => {
        if (user && user.uid) {
          this.currentProgrammerId = user.uid;
          return this.projectService.getProjectsByProgrammerId(user.uid);
        }
        this.currentProgrammerId = null;
        return of([]);
      })
    ).subscribe(projects => {
      // Aquí puedes manejar la lógica si necesitas los proyectos directamente
      // this.projects = projects;
    });

    // Asignar el observable projects$ para el template
    this.projects$ = this.authService.user$.pipe(
      switchMap((user: User | null) => {
        if (user && user.uid) {
          return this.projectService.getProjectsByProgrammerId(user.uid);
        }
        return of([]);
      })
    );
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
    if (!this.currentProgrammerId) {
      console.error('Error: Programmer ID is not available.');
      alert('Error: No se pudo obtener el ID del programador para guardar el proyecto.');
      return;
    }
    try {
      if (project.id) {
        await this.projectService.updateProject(project.id, project);
      } else {
        await this.projectService.createProject(project, this.currentProgrammerId);
      }
      this.closeModal();
      // No es necesario recargar projects$ manualmente si ya está en un switchMap reactivo
      // this.projects$ = this.authService.user$.pipe(
      //   switchMap(user => user ? this.projectService.getProjectsByProgrammerId(user.uid) : of([]))
      // );
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto: ' + (error as Error).message);
    }
  }

  async handleDeleteProject(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await this.projectService.deleteProject(id);
        // No es necesario recargar projects$ manualmente si ya está en un switchMap reactivo
        // this.projects$ = this.authService.user$.pipe(
        //   switchMap(user => user ? this.projectService.getProjectsByProgrammerId(user.uid) : of([]))
        // );
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error al eliminar el proyecto: ' + (error as Error).message);
      }
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
  }
}
