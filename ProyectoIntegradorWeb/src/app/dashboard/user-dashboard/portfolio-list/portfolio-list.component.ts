import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programmer } from '../../../models/programmer.model';
import { PortfolioService } from '../../../services/portfolio.service';
import { Router, RouterModule } from '@angular/router';
import { AsesoriaService } from '../../../services/asesoria.service'; // Import AsesoriaService
import { Schedule } from '../../../models/schedule.model'; // Import Schedule model
import { forkJoin, of } from 'rxjs'; // Import forkJoin and of for handling multiple observables
import { switchMap, map } from 'rxjs/operators'; // Import operators

// Define an interface that extends Programmer with schedule availability
interface ProgrammerWithAvailability extends Programmer {
  schedules?: Schedule[];
  isAvailable?: boolean;
}

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit {
  programmers: ProgrammerWithAvailability[] = [];
  filteredProgrammers: ProgrammerWithAvailability[] = [];
  searchTerm: string = '';
  showAvailableOnly: boolean = false; // New property for filtering by availability

  constructor(
    private portfolioService: PortfolioService,
    private asesoriaService: AsesoriaService, // Inject AsesoriaService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProgrammersWithAvailability();
  }

  loadProgrammersWithAvailability(): void {
    this.portfolioService.getProgrammers().pipe(
      switchMap(programmers => {
        if (programmers.length === 0) {
          return of([]);
        }
        const programmerObservables = programmers.map(programmer =>
          this.asesoriaService.getSchedulesByProgrammerId(programmer.uid).pipe(
            map(schedules => ({
              ...programmer,
              schedules: schedules.filter(s => s.isActive), // Only active schedules
              isAvailable: schedules.some(s => s.isActive) // Mark as available if any active schedule exists
            }))
          )
        );
        return forkJoin(programmerObservables);
      })
    ).subscribe(programmersWithAvailability => {
      this.programmers = programmersWithAvailability;
      this.filterProgrammers(); // Apply initial filtering
    });
  }

  searchProgrammers(): void {
    this.filterProgrammers(); // Re-apply filtering when search term changes
  }

  toggleShowAvailableOnly(): void {
    this.filterProgrammers(); // Re-apply filtering when availability filter changes
  }

  filterProgrammers(): void {
    let tempProgrammers = this.programmers;

    // Filter by search term
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      tempProgrammers = tempProgrammers.filter(programmer =>
        programmer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        programmer.lastname.toLowerCase().includes(lowerCaseSearchTerm) ||
        programmer.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filter by availability
    if (this.showAvailableOnly) {
      tempProgrammers = tempProgrammers.filter(programmer => programmer.isAvailable);
    }

    this.filteredProgrammers = tempProgrammers;
  }

  viewPortfolio(uid: string): void {
    this.router.navigate(['/portafolio', uid]);
  }
}
