import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectType, ProjectStatus } from '../../core/models/project.model';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent,
    AvatarComponent
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
          <p class="text-gray-600 mt-1">Manage your academic projects and internships</p>
        </div>
        <app-button variant="primary" (clicked)="openCreateModal()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </app-button>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterProjects()"
              placeholder="Search projects..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>

          <!-- Type Filter -->
          <div>
            <select
              [(ngModel)]="selectedType"
              (ngModelChange)="filterProjects()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="PFA">PFA</option>
              <option value="PFE">PFE</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterProjects()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="proposed">Proposed</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-card *ngFor="let project of filteredProjects" [clickable]="true" customClass="hover:border-indigo-200">
          <!-- Project Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
              <div class="flex items-center gap-2">
                <app-badge [variant]="getTypeBadgeVariant(project.type)" size="sm">
                  {{ project.type }}
                </app-badge>
                <app-badge [variant]="getStatusBadgeVariant(project.status)" size="sm" [dot]="true">
                  {{ formatStatus(project.status) }}
                </app-badge>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>

          <!-- Participants -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700">Student:</span>
              <span class="text-gray-900 font-medium">{{ project.student_name }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700">Supervisor:</span>
              <span class="text-gray-900 font-medium">{{ project.supervisor_name }}</span>
            </div>
          </div>

          <!-- Progress -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600">Progress</span>
              <span class="font-medium text-gray-900">{{ project.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-indigo-600 to-indigo-700 h-2 rounded-full transition-all"
                [style.width.%]="project.progress_percentage">
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div *ngIf="project.technologies && project.technologies.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                *ngFor="let tech of project.technologies.slice(0, 3)"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                {{ tech }}
              </span>
              <span
                *ngIf="project.technologies.length > 3"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{{ project.technologies.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200">
            <app-button variant="ghost" size="sm" (clicked)="openEditModal(project)" customClass="flex-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </app-button>
            <app-button variant="ghost" size="sm" (clicked)="deleteProject(project)" customClass="text-red-600 hover:bg-red-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </app-button>
          </div>
        </app-card>
      </div>

      <!-- Empty State -->
      <app-card *ngIf="filteredProjects.length === 0">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div class="mt-6">
            <app-button variant="primary" (clicked)="openCreateModal()">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Project
            </app-button>
          </div>
        </div>
      </app-card>

      <!-- Create/Edit Modal -->
      <app-modal
        [isOpen]="isModalOpen"
        [title]="isEditMode ? 'Edit Project' : 'Create New Project'"
        size="lg"
        [hasFooter]="true"
        (closed)="closeModal()">

        <form class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter project title" />
          </div>

          <!-- Type and Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                [(ngModel)]="formData.type"
                name="type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="PFA">PFA</option>
                <option value="PFE">PFE</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                [(ngModel)]="formData.status"
                name="status"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="proposed">Proposed</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter project description"></textarea>
          </div>

          <!-- Company -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              [(ngModel)]="formData.company"
              name="company"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Company name (if applicable)" />
          </div>

          <!-- Technologies -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
            <input
              type="text"
              [(ngModel)]="technologiesInput"
              name="technologies"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter technologies (comma-separated)" />
            <p class="mt-1 text-xs text-gray-500">e.g., Angular, TypeScript, Node.js</p>
          </div>

          <!-- Progress -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Progress: {{ formData.progress_percentage }}%</label>
            <input
              type="range"
              [(ngModel)]="formData.progress_percentage"
              name="progress"
              min="0"
              max="100"
              class="w-full" />
          </div>
        </form>

        <!-- Modal Footer -->
        <div modalFooter class="flex gap-3">
          <app-button variant="ghost" (clicked)="closeModal()">
            Cancel
          </app-button>
          <app-button variant="primary" (clicked)="saveProject()">
            {{ isEditMode ? 'Update' : 'Create' }} Project
          </app-button>
        </div>
      </app-modal>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  isModalOpen = false;
  isEditMode = false;

  formData: Partial<Project> = {};
  technologiesInput = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadMockProjects();
    this.filterProjects();
  }

  loadMockProjects() {
    this.projects = [
      {
        id: '1',
        title: 'E-Commerce Platform Redesign',
        type: 'PFE',
        description: 'Complete redesign of an e-commerce platform with modern UI/UX, implementing microservices architecture and cloud deployment.',
        student_email: 'student@test.com',
        student_name: 'John Student',
        supervisor_email: 'supervisor@test.com',
        supervisor_name: 'Dr. Sarah Supervisor',
        status: 'in_progress',
        company: 'Tech Solutions Inc',
        technologies: ['Angular', 'Node.js', 'MongoDB', 'AWS'],
        progress_percentage: 65,
        start_date: '2024-02-01',
        end_date: '2024-06-15'
      },
      {
        id: '2',
        title: 'Mobile Banking App Development',
        type: 'PFA',
        description: 'Native mobile application for banking services with biometric authentication and real-time transaction tracking.',
        student_email: 'student@test.com',
        student_name: 'John Student',
        supervisor_email: 'supervisor@test.com',
        supervisor_name: 'Dr. Sarah Supervisor',
        status: 'in_progress',
        company: 'FinTech Solutions',
        technologies: ['React Native', 'Firebase', 'TypeScript'],
        progress_percentage: 45,
        start_date: '2024-03-01',
        end_date: '2024-05-28'
      },
      {
        id: '3',
        title: 'AI-Powered Chatbot Integration',
        type: 'Internship',
        description: 'Integration of AI chatbot for customer service automation using natural language processing.',
        student_email: 'student@test.com',
        student_name: 'John Student',
        supervisor_email: 'supervisor@test.com',
        supervisor_name: 'Dr. Sarah Supervisor',
        status: 'under_review',
        company: 'AI Innovations Ltd',
        technologies: ['Python', 'TensorFlow', 'DialogFlow', 'FastAPI'],
        progress_percentage: 90,
        start_date: '2024-01-15',
        end_date: '2024-05-10'
      },
      {
        id: '4',
        title: 'IoT Smart Home System',
        type: 'PFE',
        description: 'Development of IoT-based smart home automation system with mobile and web interfaces.',
        student_email: 'student@test.com',
        student_name: 'John Student',
        supervisor_email: 'supervisor@test.com',
        supervisor_name: 'Dr. Sarah Supervisor',
        status: 'proposed',
        company: 'Smart Tech',
        technologies: ['Arduino', 'Raspberry Pi', 'React', 'MQTT'],
        progress_percentage: 15,
        start_date: '2024-05-01',
        end_date: '2024-09-30'
      },
      {
        id: '5',
        title: 'Blockchain Supply Chain Solution',
        type: 'PFE',
        description: 'Blockchain-based supply chain management system for transparent tracking and verification.',
        student_email: 'student@test.com',
        student_name: 'John Student',
        supervisor_email: 'supervisor@test.com',
        supervisor_name: 'Dr. Sarah Supervisor',
        status: 'completed',
        company: 'Chain Solutions',
        technologies: ['Ethereum', 'Solidity', 'Web3.js', 'React'],
        progress_percentage: 100,
        start_date: '2023-09-01',
        end_date: '2024-01-15',
        final_grade: 18.5
      }
    ];
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = !this.searchQuery ||
        project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesType = !this.selectedType || project.type === this.selectedType;
      const matchesStatus = !this.selectedStatus || project.status === this.selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.formData = {
      type: 'PFE',
      status: 'proposed',
      progress_percentage: 0,
      student_email: 'student@test.com',
      student_name: 'John Student',
      supervisor_email: 'supervisor@test.com',
      supervisor_name: 'Dr. Sarah Supervisor'
    };
    this.technologiesInput = '';
    this.isModalOpen = true;
  }

  openEditModal(project: Project) {
    this.isEditMode = true;
    this.formData = { ...project };
    this.technologiesInput = project.technologies?.join(', ') || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.formData = {};
    this.technologiesInput = '';
  }

  saveProject() {
    // Parse technologies
    if (this.technologiesInput) {
      this.formData.technologies = this.technologiesInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }

    if (this.isEditMode) {
      // Update existing project
      const index = this.projects.findIndex(p => p.id === this.formData.id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...this.formData };
      }
    } else {
      // Create new project
      const newProject: Project = {
        id: (this.projects.length + 1).toString(),
        title: this.formData.title || '',
        type: this.formData.type || 'PFE',
        status: this.formData.status || 'proposed',
        student_email: this.formData.student_email || 'student@test.com',
        student_name: this.formData.student_name || 'John Student',
        supervisor_email: this.formData.supervisor_email || 'supervisor@test.com',
        supervisor_name: this.formData.supervisor_name || 'Dr. Sarah Supervisor',
        description: this.formData.description,
        company: this.formData.company,
        technologies: this.formData.technologies,
        progress_percentage: this.formData.progress_percentage || 0,
        start_date: new Date().toISOString().split('T')[0]
      };
      this.projects.push(newProject);
    }

    this.filterProjects();
    this.closeModal();
  }

  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.filterProjects();
    }
  }

  getTypeBadgeVariant(type: ProjectType): 'primary' | 'success' | 'info' {
    const variants: { [key in ProjectType]: 'primary' | 'success' | 'info' } = {
      'PFE': 'primary',
      'PFA': 'success',
      'Internship': 'info'
    };
    return variants[type];
  }

  getStatusBadgeVariant(status: ProjectStatus): 'success' | 'warning' | 'info' | 'gray' | 'danger' {
    const variants: { [key in ProjectStatus]: 'success' | 'warning' | 'info' | 'gray' | 'danger' } = {
      'completed': 'success',
      'in_progress': 'warning',
      'under_review': 'info',
      'proposed': 'gray',
      'archived': 'gray'
    };
    return variants[status];
  }

  formatStatus(status: ProjectStatus): string {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
