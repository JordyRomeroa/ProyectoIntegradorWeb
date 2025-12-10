import { Component, OnInit, OnDestroy } from '@angular/core';

declare global {
  interface Window {
    openModalTS: (id: string) => void;
    closeModalTS: () => void;
    moveCarouselTS: (dir: number) => void;
    hoverInfo: Record<string, PerfilInfo>;
  }
}

interface PerfilInfo {
  nombre: string;
  rol: string;
  habilidades: string[];
  proyectos: string[];
  foto: string;
}

/* ================= BASE DE DATOS DEL MODAL ================= */
window.hoverInfo = {
  admin1: {
    nombre: 'Jordy Romero',
    rol: 'Lead Developer & Co-Founder',
    habilidades: ['Microservicios', 'React', 'Arquitectura moderna'],
    proyectos: ['Plataforma Cloud X', 'App empresarial'],
    foto: 'maria.jpg'
  },
  admin2: {
    nombre: 'Nayeli Barbecho',
    rol: 'Technical Lead & Co-Founder',
    habilidades: ['DevOps', 'AWS', 'CI/CD'],
    proyectos: ['Infraestructura Cloud', 'Automatización avanzada'],
    foto: 'carlos.jpg'
  },

  prog1: {
    nombre: 'Michael Lata',
    rol: 'Frontend Developer',
    habilidades: ['Angular', 'CSS Animations', 'Optimización UI'],
    proyectos: ['Dashboard UX', 'Landing premium'],
    foto: 'laura.jpg'
  },
  prog2: {
    nombre: 'David Villa',
    rol: 'Full Stack Developer',
    habilidades: ['Node.js', 'Angular', 'SQL'],
    proyectos: ['Sistema CRM', 'API escolar'],
    foto: 'jordy.jpg'
  },
  prog3: {
    nombre: 'Michael Franco',
    rol: 'Mobile Developer',
    habilidades: ['Flutter', 'Firebase'],
    proyectos: ['App médica', 'App educativa'],
    foto: 'karen.jpg'
  },
  prog4: {
    nombre: 'Juan Jose Valarezo',
    rol: 'Backend Developer',
    habilidades: ['Node.js', 'Microservicios'],
    proyectos: ['Motor de pagos', 'API financiera'],
    foto: 'stefany.jpg'
  },
  prog5: {
    nombre: 'Luis Torres',
    rol: 'Cloud Engineer',
    habilidades: ['AWS', 'GCP', 'DevOps'],
    proyectos: ['Infraestructura Cloud', 'Optimización de costos'],
    foto: 'miguel.jpg'
  },
  prog6: {
    nombre: 'Jorge Cueva',
    rol: 'Data Engineer',
    habilidades: ['Python', 'ETL', 'BigQuery'],
    proyectos: ['Data Lake empresarial', 'Pipelines ETL'],
    foto: 'miguel.jpg'
  }
};

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit, OnDestroy {

  private index = 0;
  private cardWidth = 300;
  private interval!: any;
  private carousel!: HTMLElement;

  ngOnInit(): void {
    window.openModalTS = (id) => this.openModal(id);
    window.closeModalTS = () => this.closeModal();
    window.moveCarouselTS = (dir) => this.move(dir);

    setTimeout(() => this.setupCarousel(), 200);
    this.interval = setInterval(() => this.move(1), 4500);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private setupCarousel(): void {
    this.carousel = document.getElementById('carousel')!;
    const cards = this.carousel.querySelectorAll('.prog-card');
    const style = window.getComputedStyle(cards[0] as HTMLElement);
    this.cardWidth =
      (cards[0] as HTMLElement).offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight);
  }

  move(dir: number): void {
    this.index += dir;
    const max = this.carousel.children.length - 1;

    if (this.index < 0) this.index = max;
    if (this.index > max) this.index = 0;

    const offset = this.index * this.cardWidth;
    this.carousel.style.transform = `translateX(-${offset}px)`;
  }

  /* ================= MODAL ================= */
  openModal(id: string): void {
    const info = window.hoverInfo[id];

    (document.getElementById("modal-img") as HTMLImageElement).src = `assets/${info.foto}`;
    document.getElementById("modal-nombre")!.innerText = info.nombre;
    document.getElementById("modal-rol")!.innerText = info.rol;

    document.getElementById("modal-habilidades")!.innerHTML =
      info.habilidades.map(h => `<li>${h}</li>`).join("");

    document.getElementById("modal-proyectos")!.innerHTML =
      info.proyectos.map(p => `<li>${p}</li>`).join("");

    document.getElementById("modal-bg")!.classList.add("show");
    document.getElementById("modal-box")!.classList.add("show");
  }

  closeModal(): void {
    document.getElementById("modal-bg")!.classList.remove("show");
    document.getElementById("modal-box")!.classList.remove("show");
  }
}
