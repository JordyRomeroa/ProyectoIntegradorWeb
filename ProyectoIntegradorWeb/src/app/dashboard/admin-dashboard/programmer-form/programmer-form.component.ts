import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProgrammerService } from '../../../services/admin-programmer.service';
import { AuthService } from '../../../services/auth.service';
import { Programmer } from '../../../models/programmer.model';
import { finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-programmer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './programmer-form.component.html',
  styleUrls: ['./programmer-form.component.css']
})
export class ProgrammerFormComponent implements OnInit {
  programmerForm: FormGroup;
  isEditMode: boolean = false;
  programmerUid: string | null = null;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  uploadProgress: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminProgrammerService: AdminProgrammerService,
    private authService: AuthService
  ) {
    this.programmerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null],
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      specialty: [null, Validators.required],
      description: [null, Validators.required],
      contactEmail: [null, [Validators.required, Validators.email]],
      skills: this.fb.array([]),
      socialLinks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.programmerUid = this.route.snapshot.paramMap.get('id');
    if (this.programmerUid) {
      this.isEditMode = true;
      this.loadProgrammerData(this.programmerUid);
      this.programmerForm.get('email')?.disable(); // No permitir cambiar el email en modo edición
      this.programmerForm.get('password')?.setValidators(null); // Contraseña no es obligatoria al editar
    } else {
      this.loading = false;
      this.programmerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.programmerForm.get('password')?.updateValueAndValidity();
  }

  loadProgrammerData(uid: string): void {
    this.adminProgrammerService.getProgrammerById(uid).subscribe(programmer => {
      if (programmer) {
        this.programmerForm.patchValue({
          email: programmer.email,
          name: programmer.name,
          lastname: programmer.lastname,
          specialty: programmer.specialty,
          description: programmer.description,
          contactEmail: programmer.contactEmail,
        });
        this.imageUrl = programmer.photoURL || null;

        // Cargar skills
        this.skills.clear();
        programmer.skills.forEach(skill => this.skills.push(this.fb.control(skill)));

        // Cargar social links
        this.socialLinks.clear();
        programmer.socialLinks.forEach(link => this.socialLinks.push(this.createSocialLink(link.platform, link.url)));

      } else {
        this.errorMessage = 'Programador no encontrado.';
        this.router.navigate(['/admin/programmers']);
      }
      this.loading = false;
    }, error => {
      console.error('Error al cargar datos del programador:', error);
      this.errorMessage = 'Error al cargar datos. Inténtalo de nuevo.';
      this.loading = false;
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  get skills(): FormArray {
    return this.programmerForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control(null, Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  get socialLinks(): FormArray {
    return this.programmerForm.get('socialLinks') as FormArray;
  }

  createSocialLink(platform: string = '', url: string = ''): FormGroup {
    return this.fb.group({
      platform: [platform, Validators.required],
      url: [url, [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });
  }

  addSocialLink(): void {
    this.socialLinks.push(this.createSocialLink());
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.programmerForm.invalid) {
      this.markAllAsTouched(this.programmerForm);
      this.errorMessage = 'Por favor, completa todos los campos requeridos y corrige los errores.';
      return;
    }

    this.loading = true;
    let photoURLToSave = this.imageUrl; // Usar la URL existente si no se sube nueva imagen

    try {
      // 1. Subir nueva imagen si se seleccionó una
      if (this.selectedFile) {
        const filePath = `programmers/${this.programmerUid || new Date().getTime()}_${this.selectedFile.name}`;
        photoURLToSave = await this.adminProgrammerService.uploadImage(this.selectedFile, filePath);
        this.imageUrl = photoURLToSave;
      }

      // 2. Preparar datos del programador
      const formValue = this.programmerForm.getRawValue(); // Obtener valores incluyendo campos deshabilitados
      const programmerData: Partial<Programmer> = {
        name: formValue.name,
        lastname: formValue.lastname,
        specialty: formValue.specialty,
        description: formValue.description,
        contactEmail: formValue.contactEmail,
        skills: formValue.skills,
        socialLinks: formValue.socialLinks,
        photoURL: photoURLToSave || '', // Asegurarse de guardar la URL de la foto
      };

      // 3. Crear o actualizar usuario en Firebase Auth (si es un nuevo programador)
      let programmerAuthUid = this.programmerUid;
      if (!this.isEditMode) {
        if (!formValue.email || !formValue.password) {
          throw new Error('Email y contraseña son requeridos para registrar un nuevo programador.');
        }
        const userCredential = await this.authService.registerWithEmailAndPassword(formValue.email, formValue.password, 'programador', {
          name: formValue.name,
          lastname: formValue.lastname,
          specialty: formValue.specialty,
          photoURL: photoURLToSave || '',
        });
        if (userCredential?.uid) {
          programmerAuthUid = userCredential.uid;
        } else {
          throw new Error('Error al registrar usuario en autenticación.');
        }
      }

      if (!programmerAuthUid) {
        throw new Error('No se pudo obtener el UID del programador.');
      }

      // 4. Guardar/Actualizar datos del programador en Firestore
      await this.adminProgrammerService.createOrUpdateProgrammerData(programmerAuthUid, programmerData);

      this.successMessage = this.isEditMode ? 'Programador actualizado con éxito!' : 'Programador registrado con éxito!';
      this.loading = false;
      if (!this.isEditMode) {
        this.programmerForm.reset();
        this.skills.clear();
        this.socialLinks.clear();
        this.imageUrl = null;
        this.selectedFile = null;
      }
      this.router.navigate([ 
        // eslint-disable-next-line @typescript-eslint/quotes
        '/admin/programmers'
      ]);

    } catch (error: any) {
      console.error('Error al guardar programador:', error);
      this.errorMessage = `Error al guardar programador: ${error.message || error.toString()}`;
      this.loading = false;
    }
  }

  // Función auxiliar para marcar todos los controles como tocados
  private markAllAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      }
    });
  }

  onCancel(): void {
    this.router.navigate([ 
      // eslint-disable-next-line @typescript-eslint/quotes
      '/admin/programmers'
    ]);
  }
}
