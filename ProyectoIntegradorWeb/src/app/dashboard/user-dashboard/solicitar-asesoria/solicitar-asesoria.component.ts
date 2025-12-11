import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router'; // Importar ParamMap
import { AsesoriaService } from '../../../services/asesoria.service';
import { AuthService } from '../../../services/auth.service';
import { Asesoria } from '../../../models/asesoria.model';
import { PortfolioService } from '../../../services/portfolio.service';
import { Programmer } from '../../../models/programmer.model';
import { switchMap, map, take } from 'rxjs/operators'; // Asegurarse de importar map y take
import { of, forkJoin, Observable, from } from 'rxjs'; // Importar Observable, forkJoin y from
import { User } from '@angular/fire/auth'; // Importar User

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asesoriaService: AsesoriaService,
    private authService: AuthService,
    private portfolioService: PortfolioService
  ) {
    this.asesoriaForm = this.fb.group({
      mensaje: [null, [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    forkJoin([this.authService.user$.pipe(take(1)), this.route.paramMap.pipe(take(1))]).pipe(
      switchMap(([user, paramMap]) => {
        if (!user) {
          this.router.navigate(['/login']);
          return of([null, null]); // Retorna un tipo consistente para forkJoin
        }

        this.currentUserId = user.uid;
        this.currentUserEmail = user.email;

        this.programmerId = paramMap.get('idProgramador');
        if (!this.programmerId) {
          this.errorMessage = 'ID de programador no proporcionado.';
          this.isLoading = false;
          return of([null, null]); // Retorna un tipo consistente para forkJoin
        }

        const getUserName$ = from(this.authService.getUserRole(user.uid)).pipe(
          switchMap(() => this.authService.user$.pipe(
            take(1),
            map((u: User | null) => u?.displayName || u?.email?.split('@')[0] || 'Usuario')
          ))
        );

        const getProgrammer$ = this.portfolioService.getProgrammerById(this.programmerId);

        return forkJoin([getUserName$, getProgrammer$]);
      })
    ).subscribe({
      next: ([userName, programmer]) => {
        this.currentUserName = userName as string | null;
        if (programmer) {
          this.programmerName = `${programmer.name} ${programmer.lastname}`;
        } else if (this.programmerId) {
          this.errorMessage = 'Programador no encontrado.';
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
        fechaSolicitud: new Date()
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
