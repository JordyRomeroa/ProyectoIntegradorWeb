import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../sidebar/admin.sidebar.component';
import { AsesoriaService } from '../../../services/asesoria.service';
import { AdminProgrammerService } from '../../../services/admin-programmer.service';
import { Programmer } from '../../../models/programmer.model';
import { Schedule } from '../../../models/schedule.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


interface Asesoria {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-sidebar',
  templateUrl: './asesoria.admin.html',
  styleUrls: ['./asesoria.admin.css'],
  imports: [CommonModule, AdminSidebarComponent, ReactiveFormsModule] // Añadir ReactiveFormsModule
})
export class AsesoriaAdminComponent implements OnInit {

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

  programmers$: Observable<Programmer[]> = of([]);
  selectedProgrammerId: string | null = null;
  schedules$: Observable<Schedule[]> = of([]);
  scheduleForm!: FormGroup;
  editingSchedule: Schedule | null = null;

  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots = this.generateTimeSlots();

  constructor(
    private asesoriaService: AsesoriaService,
    private adminProgrammerService: AdminProgrammerService,
    private fb: FormBuilder // Inyectar FormBuilder
  ) { }

  ngOnInit(): void {
    this.programmers$ = this.adminProgrammerService.getProgrammers();
    this.initForm();
  }

  initForm(): void {
    this.scheduleForm = this.fb.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      isActive: [true]
    });
  }

  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  }

  onProgrammerSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedProgrammerId = selectElement.value;
    if (this.selectedProgrammerId) {
      this.loadSchedules(this.selectedProgrammerId);
    } else {
      this.schedules$ = of([]);
    }
    this.resetForm();
  }

  loadSchedules(programmerId: string): void {
    this.schedules$ = this.asesoriaService.getSchedulesByProgrammerId(programmerId);
  }

  openCreateScheduleForm(): void {
    this.editingSchedule = null;
    this.resetForm();
  }

  editSchedule(schedule: Schedule): void {
    this.editingSchedule = { ...schedule };
    this.scheduleForm.patchValue({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive
    });
  }

  async saveSchedule(): Promise<void> {
    if (this.scheduleForm.invalid || !this.selectedProgrammerId) {
      alert('Por favor, complete todos los campos y seleccione un programador.');
      return;
    }

    const newSchedule: Schedule = {
      ...this.scheduleForm.value,
      programmerId: this.selectedProgrammerId
    };

    try {
      if (this.editingSchedule && this.editingSchedule.id) {
        await this.asesoriaService.updateSchedule(this.editingSchedule.id, newSchedule);
        alert('Horario actualizado con éxito');
      } else {
        await this.asesoriaService.createSchedule(newSchedule);
        alert('Horario creado con éxito');
      }
      this.loadSchedules(this.selectedProgrammerId); // Recargar horarios
      this.resetForm();
    } catch (error) {
      console.error('Error al guardar horario:', error);
      alert('Error al guardar horario.');
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      return;
    }
    try {
      await this.asesoriaService.deleteSchedule(scheduleId);
      alert('Horario eliminado con éxito');
      if (this.selectedProgrammerId) {
        this.loadSchedules(this.selectedProgrammerId); // Recargar horarios
      }
      this.resetForm();
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      alert('Error al eliminar horario.');
    }
  }

  resetForm(): void {
    this.scheduleForm.reset({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      isActive: true
    });
    this.editingSchedule = null;
  }

  aceptar(id: string) {
    console.log("Aceptar solicitud", id);
    alert("Solicitud aceptada");
  }

  rechazar(id: string) {
    console.log("Rechazar solicitud", id);
    alert("Solicitud rechazada");
  }
  getProgrammerNameFromList(programmers: Programmer[] | null): string {
  if (!programmers || !this.selectedProgrammerId) return '';
  const programmer = programmers.find(p => p.uid === this.selectedProgrammerId);
  return programmer?.name || '';
}
}
