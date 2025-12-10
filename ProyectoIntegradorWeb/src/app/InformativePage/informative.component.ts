import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informative-page',
  standalone: true,
  templateUrl: './informative.component.html',
  styleUrls: ['./informative.component.css']
})
export class InformativeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.animateCounters();
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stat-card h2');

    counters.forEach(counter => {
      const finalValue = parseInt(counter.textContent!.replace('+', ''));
      let current = 0;
      const increment = Math.ceil(finalValue / 50);

      const interval = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          current = finalValue;
          clearInterval(interval);
        }
        counter.textContent = current + '+';
      }, 20);
    });
  }


  goInicio() { this.router.navigate(['/informative']); }
  goProyectos() { this.router.navigate(['/proyectos']); }
  goEquipo() { this.router.navigate(['/Equipo']); }
  goContacto() { this.router.navigate(['/Contacto']); }
  goAsesoria() { this.router.navigate(['/asesoria']); }
  goLogin() { this.router.navigate(['/login']); }


  abrirCuenta() { this.goLogin(); }
  verProyecto(nombre: string) { this.goProyectos(); }
  solicitarAsesoria() { this.goAsesoria(); }
  registrarProgramador() { this.goLogin(); }

}
