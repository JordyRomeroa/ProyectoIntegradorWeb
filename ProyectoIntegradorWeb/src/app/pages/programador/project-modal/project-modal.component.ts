import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../models/project.interface';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Project>();

  editableProject: Project = {
    id: '',
    uid: '',
    title: '',
    description: '',
    imageUrl: '',
    status: 'En desarrollo',
    createdAt: new Date()
  };

  ngOnInit() {
    if (this.project) {
      this.editableProject = { ...this.project };
    } else {
      this.resetForm();
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      if (this.project) {
        this.editableProject = { ...this.project };
      } else {
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.editableProject = {
      id: '',
      uid: '',
      title: '',
      description: '',
      imageUrl: '',
      status: 'En desarrollo',
      createdAt: new Date()
    };
  }

  onSave() {
    this.save.emit(this.editableProject);
  }

  onClose() {
    this.close.emit();
  }
}
