import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from './sidebar/admin.sidebar.component';

interface User {
  uid: string;
  email: string;
  role: string;
  // Agrega más propiedades si las manejas en Firestore para los usuarios
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent], // Agregar FormsModule a imports
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  newUser = { email: '', password: '' }; // Changed from newProgrammer
  selectedUser: User | null = null;
  editUserData = { email: '', role: '' }; // Changed from editProgrammerData
  private usersSubscription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  loadUsers() {
    this.usersSubscription = this.authService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    }, (error: any) => {
      console.error('Error al cargar usuarios:', error);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    });
  }

  // Métodos para el modal de creación de programadores (o cualquier usuario)
  openCreateModal() {
    this.showCreateModal = true;
    this.newUser = { email: '', password: '' }; // Limpiar formulario
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  async createUser() {
    if (this.newUser.email && this.newUser.password) {
      try {
        // Por defecto, se crea con rol 'user', puedes cambiarlo a 'programmer' si es un flujo específico
        await this.authService.registerWithEmailAndPassword(this.newUser.email, this.newUser.password, 'user');
        alert('Usuario creado exitosamente');
        // loadUsers() se llama automáticamente al final de la suscripción, pero un refresh manual podría ser útil
        // this.loadUsers();
        this.closeCreateModal();
      } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario: ' + (error as Error).message);
      }
    } else {
      alert('Por favor, ingresa un email y contraseña válidos.');
    }
  }

  // Métodos para el modal de edición de USUARIOS
  openEditModal(user: User) {
    this.selectedUser = user;
    this.editUserData = { email: user.email, role: user.role };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  async editUser() {
    if (!this.selectedUser) return;

    try {
      // Si el email ha cambiado, podríamos necesitar una lógica más compleja que Firebase Auth no permite directamente.
      // Por ahora, nos enfocamos en el rol y otros datos del perfil de Firestore.
      await this.authService.setUserData(this.selectedUser.uid, this.editUserData.email, this.editUserData.role);
      alert('Usuario actualizado exitosamente');
      // loadUsers() se llama automáticamente al final de la suscripción, pero un refresh manual podría ser útil
      // this.loadUsers();
      this.closeEditModal();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario: ' + (error as Error).message);
    }
  }

  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  async deleteUser() {
    if (!this.selectedUser) return;

    try {
      // Eliminar el documento de usuario en Firestore
      await this.authService.deleteUserAndData(this.selectedUser.uid);
      alert('Usuario eliminado exitosamente');
      // loadUsers() se llama automáticamente al final de la suscripción, pero un refresh manual podría ser útil
      // this.loadUsers();
      this.closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario: ' + (error as Error).message);
    }
  }
}
