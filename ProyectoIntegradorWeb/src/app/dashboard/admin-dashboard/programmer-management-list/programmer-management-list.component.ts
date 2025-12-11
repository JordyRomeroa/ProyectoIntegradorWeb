import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AuthService } from '../../../services/auth.service'; // Importar AuthService
import { Subscription } from 'rxjs';

interface User {
  uid: string;
  email: string;
  role: string;
  // Agrega más propiedades si las manejas en Firestore para los usuarios
}

@Component({
  selector: 'app-admin-programmer-management-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // Agregar FormsModule
  templateUrl: './programmer-management-list.component.html',
  styleUrls: ['./programmer-management-list.component.css']
})
export class AdminProgrammerManagementListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  newUser = { email: '', password: '' };
  selectedUser: User | null = null;
  editUserData = { email: '', role: '' };
  private usersSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

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
    });
  }

  openCreateModal() {
    this.router.navigate(['/admin/programmers/new']);
    // this.showCreateModal = true;
    // this.newUser = { email: '', password: '' }; // Limpiar formulario
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  async createUser() {
    // Esta lógica se moverá a AdminProgrammerFormComponent
  }

  openEditModal(user: User) {
    this.router.navigate([`/admin/programmers/edit/${user.uid}`]);
    // this.selectedUser = user;
    // this.editUserData = { email: user.email, role: user.role };
    // this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  async editUser() {
    // Esta lógica se moverá a AdminProgrammerFormComponent
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
      await this.authService.deleteUserAndData(this.selectedUser.uid);
      alert('Programador eliminado exitosamente');
      this.loadUsers(); // Recargar la lista después de eliminar
      this.closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar programador:', error);
      alert('Error al eliminar programador: ' + (error as Error).message);
    }
  }
}
