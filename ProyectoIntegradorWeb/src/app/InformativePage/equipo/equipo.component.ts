import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

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
  instagram?: string;
  github?: string;
  linkedin?: string;
}


window.hoverInfo = {
  admin1: {
    nombre: 'Jordy Romero',
    rol: 'Lead Developer & Co-Founder',
    habilidades: ['Microservicios', 'React', 'Arquitectura moderna'],
    proyectos: ['Plataforma Cloud X', 'App empresarial'],
    foto: 'https://avatars.githubusercontent.com/u/236733553?s=400&u=31346ca94ed28cbe136612268be685ec657698cf&v=4',
    instagram: '//www.instagram.com/jordyromero_?igsh=Z3lpZGRpMnRmNWxh',
    github: 'https://github.com/JordyRomeroa',
    linkedin: 'https://linkedin.com/'
  },
  admin2: {
    nombre: 'Nayeli Barbecho',
    rol: 'Technical Lead & Co-Founder',
    habilidades: ['DevOps', 'AWS', 'CI/CD'],
    proyectos: ['Infraestructura Cloud', 'Automatización avanzada'],
    foto: 'https://avatars.githubusercontent.com/u/185556763?v=4',
    instagram: 'https://www.instagram.com/nayeli_barbecho?igsh=MWt6ZnlhbzM2Yjg3ag==',
    github: 'https://github.com/Nayelic98',
    linkedin: 'https://linkedin.com/'
  },

  prog1: {
    nombre: 'Michael Lata',
    rol: 'Frontend Developer',
    habilidades: ['Angular', 'CSS Animations', 'Optimización UI'],
    proyectos: ['Dashboard UX', 'Landing premium'],
    foto: 'https://avatars.githubusercontent.com/u/80653319?v=4',
    instagram: 'https://www.instagram.com/ing_mixhi?igsh=bGcwcXA0aW1zaXN1',
    github: 'https://github.com/Whiteherobot',
    linkedin: 'https://linkedin.com/'
  },

  prog2: {
    nombre: 'David Villa',
    rol: 'Full Stack Developer',
    habilidades: ['Node.js', 'Angular', 'SQL'],
    proyectos: ['Sistema CRM', 'API escolar'],
    foto: 'https://avatars.githubusercontent.com/u/129628781?v=4',
    instagram: 'https://www.instagram.com/david_villa_hdz?igsh=azJnb2hjNnFqM3pi',
    github: 'https://github.com/Davidvillahdz',
    linkedin: 'https://linkedin.com/'
  },

  prog3: {
    nombre: 'Michael Franco',
    rol: 'Mobile Developer',
    habilidades: ['Flutter', 'Firebase'],
    proyectos: ['App médica', 'App educativa'],
    foto: 'https://avatars.githubusercontent.com/u/129219376?v=4',
    instagram: 'https://www.instagram.com/michi_lata?igsh=eTVkeGg2OXU3OGNq',
    github: 'https://github.com/michfranko',
    linkedin: 'https://linkedin.com/'
  },

  prog4: {
    nombre: 'Juan Fernando',
    rol: 'Backend Developer',
    habilidades: ['Node.js', 'Microservicios'],
    proyectos: ['Motor de pagos', 'API financiera'],
    foto: 'https://avatars.githubusercontent.com/u/129233783?v=4',
    instagram: 'https://www.instagram.com/juan_fernando_518?igsh=bnp5bnozZ3RhZG5o',
    github: 'https://github.com/Juanfernando518',
    linkedin: 'https://linkedin.com/'
  },

  prog5: {
    nombre: 'Luis Torres',
    rol: 'Cloud Engineer',
    habilidades: ['AWS', 'GCP', 'DevOps'],
    proyectos: ['Infraestructura Cloud', 'Optimización de costos'],
    foto: 'https://avatars.githubusercontent.com/u/106447112?v=4',
    instagram: 'https://www.instagram.com/luis_torres2005?igsh=YXJsZm5sdXh3OGdk',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/'
  },

  prog6: {
    nombre: 'Jorge Cueva',
    rol: 'Data Engineer',
    habilidades: ['Python', 'ETL', 'BigQuery'],
    proyectos: ['Data Lake empresarial', 'Pipelines ETL'],
    foto: 'https://avatars.githubusercontent.com/u/100741077?v=4',
    instagram: 'https://www.instagram.com/sir_yorch?igsh=NnJqeW44M2V2dmNq',
    github: 'https://github.com/SirYorch',
    linkedin: 'https://linkedin.com/'
  }
};

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
  imports: [NavbarComponent]
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

  openModal(id: string): void {
    const info = window.hoverInfo[id];

    const imgEl = document.getElementById("modal-img") as HTMLImageElement;
    const foto = info.foto.trim();

    imgEl.src = foto.startsWith("http") ? foto : `assets/${foto}`;

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
