import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AsesoriaService } from '../../../services/asesoria.service';
import { AuthService } from '../../../services/auth.service';
import { Asesoria } from '../../../models/asesoria.model';
import { PortfolioService } from '../../../services/portfolio.service';
import { Programmer } from '../../../models/programmer.model';
import { switchMap, map, take } from 'rxjs/operators';
import { of, forkJoin, Observable, from } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Schedule } from '../../../models/schedule.model'; // Import Schedule model

@Component({
  selector: 'app-solicitar-asesoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-asesoria.component.html',
  styleUrls: ['./solicitar-asesoria.component.css']
})
export class SolicitarAsesoriaComponent implements OnInit {
  asesoriaForm: FormGroup;
  programmerId: string | null = null;
  programmerName: string = '';
  currentUserId: string | null = null;
  currentUserEmail: string | null = null;
  currentUserName: string | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  availableSchedules: Schedule[] = []; // Store programmer's active schedules
  availableDates: string[] = []; // Dates derived from schedules
  availableTimes: string[] = []; // Times for the selected date
  selectedDate: string = ''; // <<<<<<<<<<<<<<<<<<<< ADDED THIS LINE

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asesoriaService: AsesoriaService,
    private authService: AuthService,
    private portfolioService: PortfolioService
  ) {
    this.asesoriaForm = this.fb.group({
      fechaAsesoria: [null, Validators.required], // New form control for date
      horaAsesoria: [null, Validators.required],   // New form control for time
      mensaje: [null, [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    forkJoin([
      this.authService.user$.pipe(take(1)),
      this.route.paramMap.pipe(take(1))
    ]).pipe(
      switchMap(([user, paramMap]) => {
        if (!user) {
          this.router.navigate(['/login']);
          return of([null, null, null]);
        }

        this.currentUserId = user.uid;
        this.currentUserEmail = user.email;

        this.programmerId = paramMap.get('idProgramador');
        if (!this.programmerId) {
          this.errorMessage = 'ID de programador no proporcionado.';
          this.isLoading = false;
          return of([null, null, null]);
        }

        const getUserName$ = from(this.authService.getUserRole(user.uid)).pipe(
          switchMap(() => this.authService.user$.pipe(
            take(1),
            map((u: User | null) => u?.displayName || u?.email?.split('@')[0] || 'Usuario')
          ))
        );

        const getProgrammer$ = this.portfolioService.getProgrammerById(this.programmerId);
        const getSchedules$ = this.asesoriaService.getSchedulesByProgrammerId(this.programmerId);

        return forkJoin([getUserName$, getProgrammer$, getSchedules$]);
      })
    ).subscribe({
      next: ([userName, programmer, schedules]) => {
        this.currentUserName = userName as string | null;
        if (programmer) {
          this.programmerName = `${programmer.name} ${programmer.lastname}`;
        } else if (this.programmerId) {
          this.errorMessage = 'Programador no encontrado.';
        }

        if (schedules) {
          this.availableSchedules = schedules.filter(s => s.isActive); // Filter for active schedules
          this.generateAvailableDates();
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del programador o usuario:', err);
        this.errorMessage = 'Error al cargar información. Inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  generateAvailableDates(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const uniqueDates = new Set<string>();

    for (let i = 0; i < 14; i++) { // Look for schedules in the next 14 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];

      const hasScheduleForDay = this.availableSchedules.some(schedule => schedule.dayOfWeek === dayName);
      if (hasScheduleForDay) {
        uniqueDates.add(date.toISOString().slice(0, 10)); // Format YYYY-MM-DD
      }
    }
    this.availableDates = Array.from(uniqueDates).sort();
  }

  onDateSelected(event: Event): void {
    const selectedDateStr = (event.target as HTMLSelectElement).value;
    this.selectedDate = selectedDateStr;
    this.asesoriaForm.controls['fechaAsesoria'].setValue(new Date(selectedDateStr));
    this.updateAvailableTimes(selectedDateStr);
  }

  updateAvailableTimes(dateStr: string): void {
    this.availableTimes = [];
    if (!dateStr) return;

    const selectedDate = new Date(dateStr);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const selectedDayName = daysOfWeek[selectedDate.getDay()];

    const times: string[] = [];
    this.availableSchedules
      .filter(schedule => schedule.dayOfWeek === selectedDayName)
      .forEach(schedule => {
        // Generate hourly slots within the schedule
        let currentHour = parseInt(schedule.startTime.split(':')[0]);
        const endHour = parseInt(schedule.endTime.split(':')[0]);

        while (currentHour < endHour) {
          const time = `${String(currentHour).padStart(2, '0')}:00`;
          times.push(time);
          currentHour++;
        }
      });

    this.availableTimes = [...new Set(times)].sort(); // Ensure unique and sorted times
    this.asesoriaForm.controls['horaAsesoria'].setValue(null); // Reset time selection
  }

  async onSubmit(): Promise<void> {
    if (this.asesoriaForm.valid && this.programmerId && this.currentUserId && this.currentUserEmail && this.currentUserName) {
      this.isLoading = true;
      const newAsesoria: Asesoria = {
        idProgramador: this.programmerId,
        idUsuario: this.currentUserId,
        nombreUsuario: this.currentUserName,
        emailUsuario: this.currentUserEmail,
        mensaje: this.asesoriaForm.value.mensaje,
        estado: 'Pendiente',
        fechaSolicitud: new Date(),
        fechaAsesoria: this.asesoriaForm.value.fechaAsesoria,
        horaAsesoria: this.asesoriaForm.value.horaAsesoria,
      };

      try {
        await this.asesoriaService.solicitarAsesoria(newAsesoria);
        this.successMessage = '¡Tu solicitud de asesoría ha sido enviada con éxito!';
        this.asesoriaForm.reset();
        this.isLoading = false;
        setTimeout(() => this.router.navigate([`/portafolio/${this.programmerId}`]), 3000);
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        this.errorMessage = 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      this.asesoriaForm.markAllAsTouched();
    }
  }

  get fechaAsesoria() {
    return this.asesoriaForm.get('fechaAsesoria');
  }

  get horaAsesoria() {
    return this.asesoriaForm.get('horaAsesoria');
  }

  get mensaje() {
    return this.asesoriaForm.get('mensaje');
  }

  onBack(): void {
    if (this.programmerId) {
      this.router.navigate([`/portafolio/${this.programmerId}`]);
    } else {
      this.router.navigate([`/explorar`]);
    }
  }
}
