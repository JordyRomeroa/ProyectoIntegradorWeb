import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminProgrammerService } from '../../../services/admin-programmer.service';
import { Programmer } from '../../../models/programmer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-programmer-management-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './programmer-management-list.component.html',
  styleUrls: ['./programmer-management-list.component.css']
})
export class ProgrammerManagementListComponent implements OnInit {
  programmers$: Observable<Programmer[]> | undefined;
  errorMessage: string | null = null;

  constructor(private adminProgrammerService: AdminProgrammerService, private router: Router) { }

  ngOnInit(): void {
    this.loadProgrammers();
  }

  loadProgrammers(): void {
    this.programmers$ = this.adminProgrammerService.getProgrammers();
  }

  addProgrammer(): void {
    this.router.navigate(['/admin/programmers/new']);
  }

  editProgrammer(uid: string): void {
    this.router.navigate(['/admin/programmers/edit', uid]);
  }

  async deleteProgrammer(uid: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar a este programador?')) {
      try {
        await this.adminProgrammerService.deleteProgrammer(uid);
        this.loadProgrammers(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar programador:', error);
        this.errorMessage = 'Error al eliminar programador. Inténtalo de nuevo.';
      }
    }
  }
}
