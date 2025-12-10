import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
    enviarAsesoriaTS: () => void;
  }
}

@Component({
  selector: 'app-asesoria',
  templateUrl: './asesoria.component.html',
  styleUrls: ['./asesoria.component.css']
})
export class AsesoriaComponent implements OnInit {

  // Configuración del horario del programador
  private readonly startHour = 9;   // 09:00
  private readonly endHour = 18;    // 18:00
  private readonly slotMinutes = 30;
  private readonly disabledWeekdays = [0, 6]; // 0 = Domingo, 6 = Sábado

  ngOnInit(): void {
    // Exponer la función al HTML (sin ngSubmit, ni nada de Angular)
    window.enviarAsesoriaTS = () => this.enviarSolicitud();

    // Inicializar calendario y horarios
    this.configurarFechaMinima();
    this.registrarEventos();
    this.actualizarHorarios();
  }

  /** Pone la fecha mínima del calendario en "hoy" */
  private configurarFechaMinima(): void {
    const dateInput = document.getElementById('asesoria-date') as HTMLInputElement | null;
    if (!dateInput) return;

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  /** Registra el evento change sobre la fecha para refrescar horarios */
  private registrarEventos(): void {
    const dateInput = document.getElementById('asesoria-date') as HTMLInputElement | null;
    if (!dateInput) return;

    dateInput.addEventListener('change', () => {
      this.actualizarHorarios();
    });
  }

  /** Genera los horarios disponibles según la fecha seleccionada */
  private actualizarHorarios(): void {
    const dateInput = document.getElementById('asesoria-date') as HTMLInputElement | null;
    const timeSelect = document.getElementById('asesoria-time') as HTMLSelectElement | null;
    const helpLabel = document.getElementById('asesoria-time-help') as HTMLElement | null;

    if (!dateInput || !timeSelect || !helpLabel) return;

    const fechaSeleccionada = dateInput.value ? new Date(dateInput.value + 'T00:00:00') : null;
    timeSelect.innerHTML = ''; // limpiar opciones

    if (!fechaSeleccionada || isNaN(fechaSeleccionada.getTime())) {
      helpLabel.innerText = 'Selecciona una fecha para ver los horarios disponibles.';
      return;
    }

    const day = fechaSeleccionada.getDay();
    if (this.disabledWeekdays.includes(day)) {
      // Fin de semana u otro día bloqueado
      const option = document.createElement('option');
      option.value = '';
      option.text = 'No hay horarios disponibles para este día';
      timeSelect.appendChild(option);
      helpLabel.innerText = 'El programador solo atiende de lunes a viernes, de 09:00 a 18:00.';
      return;
    }

    // Generar slots de horario
    let hora = this.startHour;
    let minuto = 0;
    while (hora < this.endHour || (hora === this.endHour && minuto === 0)) {
      const hh = String(hora).padStart(2, '0');
      const mm = String(minuto).padStart(2, '0');
      const label = `${hh}:${mm}`;

      const option = document.createElement('option');
      option.value = label;
      option.text = label;
      timeSelect.appendChild(option);

      minuto += this.slotMinutes;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
    }

    helpLabel.innerText = 'Selecciona la hora que mejor se ajuste a tu disponibilidad.';
  }

  /** Envía la solicitud (simulado en front) */
  private enviarSolicitud(): void {
    const programmerSelect = document.getElementById('asesoria-programmer') as HTMLSelectElement | null;
    const dateInput = document.getElementById('asesoria-date') as HTMLInputElement | null;
    const timeSelect = document.getElementById('asesoria-time') as HTMLSelectElement | null;
    const messageInput = document.getElementById('asesoria-message') as HTMLTextAreaElement | null;
    const feedback = document.getElementById('asesoria-feedback') as HTMLElement | null;

    if (!programmerSelect || !dateInput || !timeSelect || !messageInput || !feedback) return;

    const programmer = programmerSelect.value;
    const fecha = dateInput.value;
    const hora = timeSelect.value;
    const mensaje = messageInput.value.trim();

    // Validaciones básicas
    if (!fecha) {
      this.mostrarFeedback(feedback, 'Por favor selecciona una fecha para la asesoría.', false);
      return;
    }
    if (!hora || hora === '' || hora.startsWith('No hay horarios')) {
      this.mostrarFeedback(feedback, 'Por favor selecciona una hora disponible.', false);
      return;
    }
    if (mensaje.length < 10) {
      this.mostrarFeedback(feedback, 'Describe brevemente tu consulta (mínimo 10 caracteres).', false);
      return;
    }

    // Aquí en un proyecto real llamarías a un servicio HTTP para enviar la solicitud.
    // Por ahora solo mostramos un mensaje elegante.
    const resumen = `Tu solicitud de asesoría con ${programmer} para el ${fecha} a las ${hora} ha sido enviada.
El programador revisará tu mensaje y confirmará la reunión en la plataforma.`;

    this.mostrarFeedback(feedback, resumen, true);

    // (Opcional) Limpiar mensaje
    messageInput.value = '';
  }

  private mostrarFeedback(el: HTMLElement, texto: string, exito: boolean): void {
    el.innerText = texto;
    el.classList.remove('feedback-ok', 'feedback-error');
    el.classList.add(exito ? 'feedback-ok' : 'feedback-error');
  }
}
