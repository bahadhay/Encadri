import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Evaluation } from '../../core/models/evaluation.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

interface ProjectEvaluation extends Evaluation {
  project_title?: string;
  student_name?: string;
  student_email?: string;
  project_type?: string;
  status?: 'pending' | 'evaluated' | 'defense_scheduled';
}

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Evaluations</h1>
          <p class="text-gray-600 mt-2">Evaluate student projects and manage defense schedules</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card [clickable]="true" customClass="hover:border-indigo-200">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg bg-indigo-100">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Projects</p>
              <p class="text-3xl font-bold text-gray-900">{{ projectEvaluations.length }}</p>
            </div>
          </div>
        </app-card>

        <app-card [clickable]="true" customClass="hover:border-yellow-200">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg bg-yellow-100">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending</p>
              <p class="text-3xl font-bold text-gray-900">{{ getPendingCount() }}</p>
            </div>
          </div>
        </app-card>

        <app-card [clickable]="true" customClass="hover:border-green-200">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Evaluated</p>
              <p class="text-3xl font-bold text-gray-900">{{ getEvaluatedCount() }}</p>
            </div>
          </div>
        </app-card>

        <app-card [clickable]="true" customClass="hover:border-blue-200">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Defense Scheduled</p>
              <p class="text-3xl font-bold text-gray-900">{{ getDefenseScheduledCount() }}</p>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterProjects()"
              placeholder="Search by project or student..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div class="min-w-[180px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterProjects()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="evaluated">Evaluated</option>
              <option value="defense_scheduled">Defense Scheduled</option>
            </select>
          </div>

          <div class="min-w-[180px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <select
              [(ngModel)]="selectedType"
              (ngModelChange)="filterProjects()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="PFE">PFE</option>
              <option value="PFA">PFA</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Projects List -->
      <app-card title="Projects to Evaluate">
        <div class="space-y-4">
          <div *ngFor="let project of filteredProjects" class="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ project.project_title }}</h3>
                  <app-badge [variant]="getProjectTypeBadge(project.project_type || '')" size="sm">
                    {{ project.project_type }}
                  </app-badge>
                  <app-badge [variant]="getStatusBadge(project.status || 'pending')" size="sm" [dot]="true">
                    {{ getStatusLabel(project.status || 'pending') }}
                  </app-badge>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ project.student_name }}</span>
                    <span class="text-gray-400">({{ project.student_email }})</span>
                  </div>
                  <div *ngIf="project.defense_date" class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Defense: {{ formatDate(project.defense_date) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <app-button
                  *ngIf="project.status === 'evaluated' || project.status === 'defense_scheduled'"
                  variant="outline"
                  size="sm"
                  (click)="viewEvaluation(project)"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </app-button>
                <app-button
                  variant="primary"
                  size="sm"
                  (click)="openEvaluationModal(project)"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ project.status === 'pending' ? 'Evaluate' : 'Edit' }}
                </app-button>
              </div>
            </div>

            <!-- Current Evaluation Display -->
            <div *ngIf="project.status !== 'pending'" class="mt-4 pt-4 border-t border-gray-300">
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Report Quality</p>
                  <p class="text-lg font-semibold text-gray-900">{{ project.report_quality_score || 0 }}/20</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Technical</p>
                  <p class="text-lg font-semibold text-gray-900">{{ project.technical_implementation_score || 0 }}/20</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Presentation</p>
                  <p class="text-lg font-semibold text-gray-900">{{ project.presentation_score || 0 }}/20</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Conduct</p>
                  <p class="text-lg font-semibold text-gray-900">{{ project.professional_conduct_score || 0 }}/20</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Final Grade</p>
                  <p class="text-2xl font-bold" [class]="getGradeColor(project.final_grade || 0)">
                    {{ project.final_grade || 0 }}/20
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredProjects.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-lg">No projects found matching your filters</p>
          </div>
        </div>
      </app-card>

      <!-- Evaluation Modal -->
      <div *ngIf="showEvaluationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isViewMode ? 'View Evaluation' : (selectedProject?.status === 'pending' ? 'Evaluate Project' : 'Edit Evaluation') }}
            </h2>
            <button (click)="closeEvaluationModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Project Info -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedProject?.project_title }}</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Student:</span> {{ selectedProject?.student_name }}</p>
                <p><span class="font-medium">Type:</span> {{ selectedProject?.project_type }}</p>
              </div>
            </div>

            <!-- Scoring Criteria -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Evaluation Criteria</h3>
              <p class="text-sm text-gray-600">Rate each criterion out of 20 points</p>

              <!-- Report Quality -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Report Quality
                    <span class="text-xs text-gray-500 ml-2">(Writing, structure, references)</span>
                  </label>
                  <span class="text-lg font-semibold text-indigo-600">{{ evaluationForm.report_quality_score }}/20</span>
                </div>
                <input
                  type="range"
                  [(ngModel)]="evaluationForm.report_quality_score"
                  (ngModelChange)="calculateFinalGrade()"
                  [disabled]="isViewMode"
                  min="0"
                  max="20"
                  step="0.5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <!-- Technical Implementation -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Technical Implementation
                    <span class="text-xs text-gray-500 ml-2">(Code quality, architecture, innovation)</span>
                  </label>
                  <span class="text-lg font-semibold text-indigo-600">{{ evaluationForm.technical_implementation_score }}/20</span>
                </div>
                <input
                  type="range"
                  [(ngModel)]="evaluationForm.technical_implementation_score"
                  (ngModelChange)="calculateFinalGrade()"
                  [disabled]="isViewMode"
                  min="0"
                  max="20"
                  step="0.5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <!-- Presentation -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Presentation Skills
                    <span class="text-xs text-gray-500 ml-2">(Communication, slides, demonstration)</span>
                  </label>
                  <span class="text-lg font-semibold text-indigo-600">{{ evaluationForm.presentation_score }}/20</span>
                </div>
                <input
                  type="range"
                  [(ngModel)]="evaluationForm.presentation_score"
                  (ngModelChange)="calculateFinalGrade()"
                  [disabled]="isViewMode"
                  min="0"
                  max="20"
                  step="0.5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <!-- Professional Conduct -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Professional Conduct
                    <span class="text-xs text-gray-500 ml-2">(Attendance, deadlines, responsiveness)</span>
                  </label>
                  <span class="text-lg font-semibold text-indigo-600">{{ evaluationForm.professional_conduct_score }}/20</span>
                </div>
                <input
                  type="range"
                  [(ngModel)]="evaluationForm.professional_conduct_score"
                  (ngModelChange)="calculateFinalGrade()"
                  [disabled]="isViewMode"
                  min="0"
                  max="20"
                  step="0.5"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <!-- Final Grade -->
            <div class="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700">Final Grade (Average)</p>
                  <p class="text-xs text-gray-500 mt-1">Automatically calculated from all criteria</p>
                </div>
                <p class="text-4xl font-bold" [class]="getGradeColor(evaluationForm.final_grade)">
                  {{ evaluationForm.final_grade.toFixed(2) }}/20
                </p>
              </div>
            </div>

            <!-- Defense Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Defense Date & Time</label>
              <input
                type="datetime-local"
                [(ngModel)]="evaluationForm.defense_date"
                [disabled]="isViewMode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <!-- Comments -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Comments & Feedback</label>
              <textarea
                [(ngModel)]="evaluationForm.comments"
                [disabled]="isViewMode"
                rows="4"
                placeholder="Provide detailed feedback on the project..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              ></textarea>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <app-button variant="ghost" (click)="closeEvaluationModal()">
              {{ isViewMode ? 'Close' : 'Cancel' }}
            </app-button>
            <app-button *ngIf="!isViewMode" variant="primary" (click)="saveEvaluation()">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Evaluation
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EvaluationsComponent implements OnInit {
  projectEvaluations: ProjectEvaluation[] = [];
  filteredProjects: ProjectEvaluation[] = [];

  searchTerm = '';
  selectedStatus = 'all';
  selectedType = 'all';

  showEvaluationModal = false;
  isViewMode = false;
  selectedProject: ProjectEvaluation | null = null;

  evaluationForm = {
    report_quality_score: 0,
    technical_implementation_score: 0,
    presentation_score: 0,
    professional_conduct_score: 0,
    final_grade: 0,
    defense_date: '',
    comments: ''
  };

  ngOnInit() {
    this.loadMockData();
    this.filterProjects();
  }

  loadMockData() {
    this.projectEvaluations = [
      {
        id: '1',
        project_id: '1',
        project_title: 'E-Commerce Platform with AI Recommendations',
        student_name: 'John Doe',
        student_email: 'john.doe@student.edu',
        project_type: 'PFE',
        status: 'evaluated',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor',
        report_quality_score: 17,
        technical_implementation_score: 18,
        presentation_score: 16,
        professional_conduct_score: 19,
        final_grade: 17.5,
        defense_date: '2024-06-15T10:00:00',
        comments: 'Excellent project with innovative AI integration. Well-structured report and clean code implementation. Strong presentation skills demonstrated.',
        created_date: new Date('2024-05-20')
      },
      {
        id: '2',
        project_id: '2',
        project_title: 'Mobile Banking Application Security',
        student_name: 'Sarah Smith',
        student_email: 'sarah.smith@student.edu',
        project_type: 'PFE',
        status: 'defense_scheduled',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor',
        report_quality_score: 16,
        technical_implementation_score: 17,
        presentation_score: 15.5,
        professional_conduct_score: 18,
        final_grade: 16.625,
        defense_date: '2024-06-20T14:00:00',
        comments: 'Strong focus on security best practices. Good implementation of encryption and authentication mechanisms. Report could benefit from more detailed testing section.',
        created_date: new Date('2024-05-22')
      },
      {
        id: '3',
        project_id: '3',
        project_title: 'IoT Smart Home Management System',
        student_name: 'Mike Johnson',
        student_email: 'mike.johnson@student.edu',
        project_type: 'PFA',
        status: 'pending',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor'
      },
      {
        id: '4',
        project_id: '4',
        project_title: 'Real-time Data Analytics Dashboard',
        student_name: 'Emily Chen',
        student_email: 'emily.chen@student.edu',
        project_type: 'Internship',
        status: 'pending',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor'
      },
      {
        id: '5',
        project_id: '5',
        project_title: 'Blockchain-based Supply Chain Tracker',
        student_name: 'David Martinez',
        student_email: 'david.martinez@student.edu',
        project_type: 'PFE',
        status: 'evaluated',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor',
        report_quality_score: 15,
        technical_implementation_score: 16,
        presentation_score: 14,
        professional_conduct_score: 17,
        final_grade: 15.5,
        defense_date: '2024-06-18T11:00:00',
        comments: 'Good understanding of blockchain concepts. Implementation is solid but could be optimized. Presentation was clear but lacked depth in technical explanations.',
        created_date: new Date('2024-05-25')
      },
      {
        id: '6',
        project_id: '6',
        project_title: 'Machine Learning Image Classification',
        student_name: 'Lisa Anderson',
        student_email: 'lisa.anderson@student.edu',
        project_type: 'PFA',
        status: 'pending',
        evaluator_email: 'supervisor@university.edu',
        evaluator_name: 'Dr. Sarah Supervisor'
      }
    ];
  }

  filterProjects() {
    this.filteredProjects = this.projectEvaluations.filter(project => {
      const matchesSearch = !this.searchTerm ||
        project.project_title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.student_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.student_email?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || project.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || project.project_type === this.selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  getPendingCount(): number {
    return this.projectEvaluations.filter(p => p.status === 'pending').length;
  }

  getEvaluatedCount(): number {
    return this.projectEvaluations.filter(p => p.status === 'evaluated').length;
  }

  getDefenseScheduledCount(): number {
    return this.projectEvaluations.filter(p => p.status === 'defense_scheduled').length;
  }

  openEvaluationModal(project: ProjectEvaluation) {
    this.selectedProject = project;
    this.isViewMode = false;

    // Populate form with existing data if editing
    this.evaluationForm = {
      report_quality_score: project.report_quality_score || 0,
      technical_implementation_score: project.technical_implementation_score || 0,
      presentation_score: project.presentation_score || 0,
      professional_conduct_score: project.professional_conduct_score || 0,
      final_grade: project.final_grade || 0,
      defense_date: project.defense_date ? this.formatDateTimeLocal(project.defense_date) : '',
      comments: project.comments || ''
    };

    if (project.status === 'pending') {
      this.calculateFinalGrade();
    }

    this.showEvaluationModal = true;
  }

  viewEvaluation(project: ProjectEvaluation) {
    this.selectedProject = project;
    this.isViewMode = true;

    this.evaluationForm = {
      report_quality_score: project.report_quality_score || 0,
      technical_implementation_score: project.technical_implementation_score || 0,
      presentation_score: project.presentation_score || 0,
      professional_conduct_score: project.professional_conduct_score || 0,
      final_grade: project.final_grade || 0,
      defense_date: project.defense_date ? this.formatDateTimeLocal(project.defense_date) : '',
      comments: project.comments || ''
    };

    this.showEvaluationModal = true;
  }

  closeEvaluationModal() {
    this.showEvaluationModal = false;
    this.selectedProject = null;
    this.isViewMode = false;
  }

  calculateFinalGrade() {
    const scores = [
      this.evaluationForm.report_quality_score,
      this.evaluationForm.technical_implementation_score,
      this.evaluationForm.presentation_score,
      this.evaluationForm.professional_conduct_score
    ];

    const sum = scores.reduce((a, b) => a + b, 0);
    this.evaluationForm.final_grade = sum / 4;
  }

  saveEvaluation() {
    if (!this.selectedProject) return;

    // Update the project with evaluation data
    const index = this.projectEvaluations.findIndex(p => p.id === this.selectedProject?.id);
    if (index !== -1) {
      this.projectEvaluations[index] = {
        ...this.projectEvaluations[index],
        report_quality_score: this.evaluationForm.report_quality_score,
        technical_implementation_score: this.evaluationForm.technical_implementation_score,
        presentation_score: this.evaluationForm.presentation_score,
        professional_conduct_score: this.evaluationForm.professional_conduct_score,
        final_grade: this.evaluationForm.final_grade,
        defense_date: this.evaluationForm.defense_date || undefined,
        comments: this.evaluationForm.comments,
        status: this.evaluationForm.defense_date ? 'defense_scheduled' : 'evaluated',
        updated_date: new Date()
      };
    }

    this.filterProjects();
    this.closeEvaluationModal();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not scheduled';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTimeLocal(date: Date | string | undefined): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getProjectTypeBadge(type: string): 'primary' | 'success' | 'info' {
    const badges: { [key: string]: 'primary' | 'success' | 'info' } = {
      'PFE': 'primary',
      'PFA': 'success',
      'Internship': 'info'
    };
    return badges[type] || 'primary';
  }

  getStatusBadge(status: string): 'warning' | 'success' | 'info' {
    const badges: { [key: string]: 'warning' | 'success' | 'info' } = {
      'pending': 'warning',
      'evaluated': 'success',
      'defense_scheduled': 'info'
    };
    return badges[status] || 'warning';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending Evaluation',
      'evaluated': 'Evaluated',
      'defense_scheduled': 'Defense Scheduled'
    };
    return labels[status] || status;
  }

  getGradeColor(grade: number): string {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 14) return 'text-blue-600';
    if (grade >= 12) return 'text-yellow-600';
    if (grade >= 10) return 'text-orange-600';
    return 'text-red-600';
  }
}
