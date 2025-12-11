import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class ProjectModalComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Project>();

  editableProject: Project = this.getDefaultProject();

  ngOnInit() {
    this.initializeEditableProject();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] || changes['isOpen']) {
      this.initializeEditableProject();
    }
  }

  private getDefaultProject(): Project {
    return {
      uid: '',
      name: '',
      description: '',
      title:  '',
      imageUrl: '',
      roleInProject: '',
      technologies: [],
      repositoryLink: '',
      deployLink: '',
      type: 'Academico',
      status: 'En desarrollo',
      createdAt: new Date()
    };
  }

  private initializeEditableProject(): void {
    if (this.project) {
      // Deep copy to avoid modifying the input project directly
      this.editableProject = { ...this.project };
    } else {
      this.editableProject = this.getDefaultProject();
    }
  }

  onSave() {
    this.save.emit(this.editableProject);
  }

  onClose() {
    this.close.emit();
    this.editableProject = this.getDefaultProject(); // Reset form on close
  }
}
