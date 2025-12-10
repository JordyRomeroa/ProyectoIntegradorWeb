import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informative-page',
  standalone: true,
  templateUrl: './informative.component.html',
  styleUrls: ['./informative.component.css']
})
export class InformativeComponent implements OnInit {

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

  abrirCuenta() {
    console.log('Abrir panel de usuario');
  }

  verProyecto(nombre: string) {
    console.log('Ver proyecto:', nombre);
  }

  solicitarAsesoria() {
    console.log('Solicitando asesoría...');
  }

  registrarProgramador() {
    console.log('Registrando programador...');
  }
}
