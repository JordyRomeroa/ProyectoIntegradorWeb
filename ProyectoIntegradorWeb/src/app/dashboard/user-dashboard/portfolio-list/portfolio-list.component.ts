import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programmer } from '../../../models/programmer.model';
import { PortfolioService } from '../../../services/portfolio.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit {
  programmers: Programmer[] = [];
  filteredProgrammers: Programmer[] = [];
  searchTerm: string = '';

  constructor(private portfolioService: PortfolioService, private router: Router) { }

  ngOnInit(): void {
    this.portfolioService.getProgrammers().subscribe(programmers => {
      this.programmers = programmers;
      this.filteredProgrammers = programmers;
    });
  }

  searchProgrammers(): void {
    this.filteredProgrammers = this.programmers.filter(programmer =>
      programmer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      programmer.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      programmer.skills.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  viewPortfolio(uid: string): void {
    this.router.navigate(['/portafolio', uid]);
  }
}
