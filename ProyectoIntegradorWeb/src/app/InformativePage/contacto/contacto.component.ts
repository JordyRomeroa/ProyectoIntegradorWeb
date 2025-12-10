import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {

  faqIndex = -1;

  faqs = [
    { q: "¿Cuánto tardan en responder?",
      a: "Nuestro tiempo promedio de respuesta es entre 1 y 3 horas hábiles." },

    { q: "¿Ofrecen asesorías personalizadas?",
      a: "Sí, puedes agendar asesorías 1:1 para tus proyectos o consultas." },

    { q: "¿Los proyectos son reales?",
      a: "Sí, trabajamos con proyectos activos utilizados en entornos productivos." },

    { q: "¿Puedo formar parte del equipo?",
      a: "Claro, revisamos portfolios y repositorios constantemente." }
  ];

  toggleFAQ(index: number) {
    this.faqIndex = this.faqIndex === index ? -1 : index;
  }

  enviarFormulario() {
    alert("¡Gracias por tu mensaje! Responderemos pronto.");
  }

  abrirWhatsApp() {
    window.open("https://wa.me/593983640353?text=Hola,%20quisiera%20más%20información.", "_blank");
  }
}
