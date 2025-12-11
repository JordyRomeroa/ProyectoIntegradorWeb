import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminProgrammerService } from '../../../services/admin-programmer.service';
import { Programmer } from '../../../models/programmer.model';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; // Importar User de @angular/fire/auth

@Component({
  selector: 'app-admin-programmer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './programmer-form.component.html',
  styleUrls: ['./programmer-form.component.css']
})
export class AdminProgrammerFormComponent implements OnInit {
  isEditMode: boolean = false;
  programmerId: string | null = null;
  formData: Partial<Programmer & { email: string, password?: string }> = {
    email: '',
    password: '',
    role: 'programador',
    name: '',
    lastname: '',
    specialty: '',
    description: '',
    photoURL: '',
    contactLinks: '',
    socialNetworks: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private adminProgrammerService: AdminProgrammerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.programmerId = params.get('id');
      this.isEditMode = !!this.programmerId;
      if (this.isEditMode && this.programmerId) {
        this.loadProgrammerData(this.programmerId);
      }
    });
  }

  loadProgrammerData(id: string): void {
    this.adminProgrammerService.getProgrammerById(id).subscribe(programmer => {
      if (programmer) {
        this.formData = {
          ...programmer,
          email: programmer.email || '',
          contactLinks: programmer.contactLinks || '',
          socialNetworks: programmer.socialNetworks || '',
        };
      } else {
        alert('Programador no encontrado.');
        this.router.navigate(['/admin/programmers']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.email) {
      alert('El email es obligatorio.');
      return;
    }

    const programmerDataToSave: Partial<Programmer> = {
      name: this.formData.name,
      lastname: this.formData.lastname,
      specialty: this.formData.specialty,
      description: this.formData.description,
      photoURL: this.formData.photoURL,
      contactLinks: this.formData.contactLinks,
      socialNetworks: this.formData.socialNetworks,
      role: this.formData.role // Asegurarse de que el rol se mantenga o se establezca
    };

    try {
      if (this.isEditMode && this.programmerId) {
        await this.adminProgrammerService.createOrUpdateProgrammerData(this.programmerId, programmerDataToSave);
        alert('Programador actualizado exitosamente.');
      } else {
        if (!this.formData.password) {
          alert('La contraseña es obligatoria para nuevos registros.');
          return;
        }
        const user: User | null = await this.authService.registerWithEmailAndPassword(this.formData.email, this.formData.password, this.formData.role || 'programador');
        
        if (user && user.uid) {
          await this.adminProgrammerService.createOrUpdateProgrammerData(user.uid, programmerDataToSave);
          alert('Programador registrado exitosamente.');
        } else {
          alert('Error al registrar usuario: no se pudo obtener el UID.');
        }
      }
      this.router.navigate(['/admin/programmers']);
    } catch (error) {
      console.error('Error al guardar programador:', error);
      alert('Error al guardar programador: ' + (error as Error).message);
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/programmers']);
  }
}
