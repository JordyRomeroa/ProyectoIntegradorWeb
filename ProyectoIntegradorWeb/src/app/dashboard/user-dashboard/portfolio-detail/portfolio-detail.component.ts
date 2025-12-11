import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Programmer } from '../../../models/programmer.model';
import { Project } from '../../../models/project.interface';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css']
})
export class PortfolioDetailComponent implements OnInit {
  programmer: Programmer | undefined;
  projects: Project[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Modificado de private a public
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const programmerId = params.get('id');
        if (programmerId) {
          const programmer$ = this.portfolioService.getProgrammerById(programmerId);
          const projects$ = this.portfolioService.getProjectsByProgrammerId(programmerId);
          return forkJoin([programmer$, projects$]);
        } else {
          this.error = 'ID de programador no proporcionado.';
          this.loading = false;
          return new Observable<[Programmer | undefined, Project[]]>(); // Retorna un observable vacío
        }
      })
    ).subscribe({
      next: ([programmer, projects]) => {
        this.programmer = programmer;
        this.projects = projects;
        this.loading = false;
        if (!programmer) {
          this.error = 'Programador no encontrado.';
        }
      },
      error: (err) => {
        console.error('Error al cargar el portafolio:', err);
        this.error = 'Error al cargar el portafolio. Inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  contactProgrammer(programmerId: string): void {
    this.router.navigate(['/asesoria', programmerId]);
  }
}
