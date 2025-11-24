import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Submission } from '../../core/models/submission.model';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

interface SubmissionWithFiles extends Submission {
  files?: { name: string; size: string; type: string }[];
  comments?: { author: string; text: string; date: string }[];
  project_title?: string;
  student_name?: string;
}

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    ModalComponent,
    AvatarComponent
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Submissions</h1>
          <p class="text-gray-600 mt-1">Track and manage your project submissions</p>
        </div>
        <app-button variant="primary" (clicked)="openUploadModal()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Submission
        </app-button>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Project Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              [(ngModel)]="selectedProject"
              (ngModelChange)="filterSubmissions()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Projects</option>
              <option value="E-Commerce Platform">E-Commerce Platform</option>
              <option value="Mobile Banking App">Mobile Banking App</option>
              <option value="AI Chatbot">AI Chatbot</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterSubmissions()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_revision">Revision Required</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              [(ngModel)]="selectedType"
              (ngModelChange)="filterSubmissions()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="deliverable">Deliverable</option>
              <option value="report">Report</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Submissions List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card *ngFor="let submission of filteredSubmissions" [clickable]="true" customClass="hover:border-indigo-200">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ submission.title }}</h3>
              <p class="text-sm text-gray-600">{{ submission.project_title }}</p>
            </div>
            <app-badge [variant]="getStatusBadgeVariant(submission.status)" [dot]="true">
              {{ formatStatus(submission.status) }}
            </app-badge>
          </div>

          <!-- Description -->
          <p *ngIf="submission.description" class="text-sm text-gray-600 mb-4">{{ submission.description }}</p>

          <!-- Files -->
          <div *ngIf="submission.files && submission.files.length > 0" class="mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="font-medium">{{ submission.files.length }} file(s)</span>
            </div>
            <div class="space-y-1">
              <div *ngFor="let file of submission.files.slice(0, 2)" class="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="flex-1 truncate">{{ file.name }}</span>
                <span class="text-gray-400">{{ file.size }}</span>
              </div>
              <p *ngIf="submission.files.length > 2" class="text-xs text-gray-500 pl-2">
                +{{ submission.files.length - 2 }} more files
              </p>
            </div>
          </div>

          <!-- Meta Info -->
          <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(submission.created_date) }}</span>
              </div>
              <app-badge [variant]="getTypeBadgeVariant(submission.type)" size="sm">
                {{ submission.type }}
              </app-badge>
            </div>
          </div>

          <!-- Grade (if graded) -->
          <div *ngIf="submission.grade !== undefined" class="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-indigo-900">Grade</span>
              <span class="text-2xl font-bold text-indigo-600">{{ submission.grade }}/20</span>
            </div>
            <div *ngIf="submission.feedback" class="mt-2 text-sm text-indigo-700">
              "{{ submission.feedback }}"
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200">
            <app-button variant="ghost" size="sm" (clicked)="viewSubmission(submission)" customClass="flex-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </app-button>
            <app-button
              *ngIf="authService.isSupervisor() && submission.status === 'pending'"
              variant="primary"
              size="sm"
              (clicked)="openGradingModal(submission)">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Grade
            </app-button>
          </div>
        </app-card>
      </div>

      <!-- Empty State -->
      <app-card *ngIf="filteredSubmissions.length === 0">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by uploading your first submission.</p>
          <div class="mt-6">
            <app-button variant="primary" (clicked)="openUploadModal()">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Submission
            </app-button>
          </div>
        </div>
      </app-card>

      <!-- Upload Modal -->
      <app-modal
        [isOpen]="isUploadModalOpen"
        title="Upload New Submission"
        size="lg"
        [hasFooter]="true"
        (closed)="closeUploadModal()">

        <form class="space-y-4">
          <!-- Project Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project *</label>
            <select
              [(ngModel)]="uploadForm.project_title"
              name="project"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select a project</option>
              <option value="E-Commerce Platform">E-Commerce Platform Redesign</option>
              <option value="Mobile Banking App">Mobile Banking App Development</option>
              <option value="AI Chatbot">AI-Powered Chatbot Integration</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Submission Title *</label>
            <input
              type="text"
              [(ngModel)]="uploadForm.title"
              name="title"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Sprint 2 Deliverables" />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              [(ngModel)]="uploadForm.type"
              name="type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="deliverable">Deliverable</option>
              <option value="report">Report</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              [(ngModel)]="uploadForm.description"
              name="description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe what you're submitting..."></textarea>
          </div>

          <!-- File Upload Area -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Files *</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">
                <span class="text-indigo-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 mt-1">PDF, DOC, ZIP up to 50MB</p>
            </div>
            <p class="mt-2 text-xs text-gray-500">Note: File upload is simulated in demo mode</p>
          </div>
        </form>

        <!-- Modal Footer -->
        <div modalFooter class="flex gap-3">
          <app-button variant="ghost" (clicked)="closeUploadModal()">
            Cancel
          </app-button>
          <app-button variant="primary" (clicked)="submitUpload()">
            Upload Submission
          </app-button>
        </div>
      </app-modal>

      <!-- View/Grade Modal -->
      <app-modal
        [isOpen]="isViewModalOpen"
        [title]="selectedSubmission?.title || 'Submission Details'"
        size="xl"
        [hasFooter]="false"
        (closed)="closeViewModal()">

        <div *ngIf="selectedSubmission" class="space-y-6">
          <!-- Submission Info -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm text-gray-600">Project</p>
              <p class="font-medium text-gray-900">{{ selectedSubmission.project_title }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Submitted By</p>
              <p class="font-medium text-gray-900">{{ selectedSubmission.student_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Type</p>
              <app-badge [variant]="getTypeBadgeVariant(selectedSubmission.type)">
                {{ selectedSubmission.type }}
              </app-badge>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status</p>
              <app-badge [variant]="getStatusBadgeVariant(selectedSubmission.status)" [dot]="true">
                {{ formatStatus(selectedSubmission.status) }}
              </app-badge>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-600">Submitted On</p>
              <p class="font-medium text-gray-900">{{ formatDate(selectedSubmission.created_date) }}</p>
            </div>
          </div>

          <!-- Description -->
          <div *ngIf="selectedSubmission.description">
            <h4 class="font-medium text-gray-900 mb-2">Description</h4>
            <p class="text-gray-600">{{ selectedSubmission.description }}</p>
          </div>

          <!-- Files -->
          <div *ngIf="selectedSubmission.files && selectedSubmission.files.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">Files ({{ selectedSubmission.files.length }})</h4>
            <div class="space-y-2">
              <div *ngFor="let file of selectedSubmission.files" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">{{ file.type }} • {{ file.size }}</p>
                  </div>
                </div>
                <app-button variant="ghost" size="sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </app-button>
              </div>
            </div>
          </div>

          <!-- Grading Section (Supervisor Only) -->
          <div *ngIf="authService.isSupervisor()" class="border-t border-gray-200 pt-6">
            <h4 class="font-medium text-gray-900 mb-4">Grading</h4>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Grade (out of 20)</label>
                  <input
                    type="number"
                    [(ngModel)]="gradingForm.grade"
                    min="0"
                    max="20"
                    step="0.5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    [(ngModel)]="gradingForm.status"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                    <option value="needs_revision">Revision Required</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                <textarea
                  [(ngModel)]="gradingForm.feedback"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Provide detailed feedback..."></textarea>
              </div>
              <app-button variant="primary" (clicked)="saveGrade()">
                Submit Grade
              </app-button>
            </div>
          </div>

          <!-- Current Grade Display -->
          <div *ngIf="selectedSubmission.grade !== undefined" class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-indigo-900">Final Grade</h4>
              <span class="text-3xl font-bold text-indigo-600">{{ selectedSubmission.grade }}/20</span>
            </div>
            <div *ngIf="selectedSubmission.feedback">
              <p class="text-sm font-medium text-indigo-900 mb-1">Feedback:</p>
              <p class="text-sm text-indigo-700">{{ selectedSubmission.feedback }}</p>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="border-t border-gray-200 pt-6">
            <h4 class="font-medium text-gray-900 mb-4">Comments</h4>
            <div class="space-y-4">
              <div *ngFor="let comment of selectedSubmission.comments" class="flex gap-3">
                <app-avatar [name]="comment.author" size="sm"></app-avatar>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-gray-900 text-sm">{{ comment.author }}</span>
                    <span class="text-xs text-gray-500">{{ comment.date }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ comment.text }}</p>
                </div>
              </div>

              <!-- Add Comment -->
              <div class="flex gap-3 pt-4 border-t border-gray-200">
                <app-avatar [name]="(authService.currentUser$ | async)?.full_name || 'User'" size="sm"></app-avatar>
                <div class="flex-1">
                  <textarea
                    [(ngModel)]="newComment"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="Add a comment..."></textarea>
                  <div class="mt-2 flex justify-end">
                    <app-button variant="primary" size="sm" (clicked)="addComment()">
                      Post Comment
                    </app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-modal>
    </div>
  `
})
export class SubmissionsComponent implements OnInit {
  submissions: SubmissionWithFiles[] = [];
  filteredSubmissions: SubmissionWithFiles[] = [];

  selectedProject = '';
  selectedStatus = '';
  selectedType = '';

  isUploadModalOpen = false;
  isViewModalOpen = false;
  selectedSubmission: SubmissionWithFiles | null = null;

  uploadForm: Partial<SubmissionWithFiles> = {};
  gradingForm = { grade: 0, status: 'approved', feedback: '' };
  newComment = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadMockSubmissions();
    this.filterSubmissions();
  }

  loadMockSubmissions() {
    this.submissions = [
      {
        id: '1',
        project_id: '1',
        project_title: 'E-Commerce Platform',
        title: 'Sprint 1 - UI Components',
        description: 'Completed all reusable UI components including navigation, product cards, and cart functionality.',
        type: 'code',
        created_date: '2024-03-15',
        submitted_by: 'student@test.com',
        student_name: 'John Student',
        status: 'approved',
        grade: 18.5,
        feedback: 'Excellent work! The components are well-structured and follow best practices.',
        files: [
          { name: 'ui-components.zip', size: '2.4 MB', type: 'ZIP' },
          { name: 'documentation.pdf', size: '856 KB', type: 'PDF' }
        ],
        comments: [
          { author: 'Dr. Sarah Supervisor', text: 'Great attention to accessibility!', date: '2024-03-16' },
          { author: 'John Student', text: 'Thank you! I followed WCAG guidelines.', date: '2024-03-16' }
        ]
      },
      {
        id: '2',
        project_id: '2',
        project_title: 'Mobile Banking App',
        title: 'Backend API Implementation',
        description: 'RESTful API with authentication, transaction management, and account services.',
        type: 'documentation',
        created_date: '2024-03-20',
        submitted_by: 'student@test.com',
        student_name: 'John Student',
        status: 'pending',
        files: [
          { name: 'api-source-code.zip', size: '5.2 MB', type: 'ZIP' },
          { name: 'api-documentation.pdf', size: '1.2 MB', type: 'PDF' },
          { name: 'postman-collection.json', size: '45 KB', type: 'JSON' }
        ],
        comments: []
      },
      {
        id: '3',
        project_id: '3',
        project_title: 'AI Chatbot',
        title: 'Monthly Progress Report - March',
        description: 'Detailed report on chatbot training, integration progress, and performance metrics.',
        type: 'report',
        created_date: '2024-03-28',
        submitted_by: 'student@test.com',
        student_name: 'John Student',
        status: 'needs_revision',
        grade: 14,
        feedback: 'Good progress but needs more detailed analysis of accuracy metrics. Please add comparison charts.',
        files: [
          { name: 'march-report.pdf', size: '3.1 MB', type: 'PDF' },
          { name: 'performance-data.xlsx', size: '234 KB', type: 'XLSX' }
        ],
        comments: [
          { author: 'Dr. Sarah Supervisor', text: 'Please add the comparison with baseline model.', date: '2024-03-29' }
        ]
      },
      {
        id: '4',
        project_id: '1',
        project_title: 'E-Commerce Platform',
        title: 'Database Schema Design',
        description: 'Complete database schema with ER diagrams and normalization documentation.',
        type: 'code',
        created_date: '2024-02-20',
        submitted_by: 'student@test.com',
        student_name: 'John Student',
        status: 'approved',
        grade: 17,
        feedback: 'Well-designed schema with proper normalization. Good use of indexes.',
        files: [
          { name: 'schema-design.pdf', size: '1.8 MB', type: 'PDF' },
          { name: 'er-diagram.png', size: '456 KB', type: 'PNG' }
        ],
        comments: []
      }
    ];
  }

  filterSubmissions() {
    this.filteredSubmissions = this.submissions.filter(submission => {
      const matchesProject = !this.selectedProject ||
        submission.project_title?.toLowerCase().includes(this.selectedProject.toLowerCase());
      const matchesStatus = !this.selectedStatus || submission.status === this.selectedStatus;
      const matchesType = !this.selectedType || submission.type === this.selectedType;

      return matchesProject && matchesStatus && matchesType;
    });
  }

  openUploadModal() {
    this.uploadForm = {
      type: 'code',
      created_date: new Date().toISOString().split('T')[0],
      submitted_by: 'student@test.com',
      student_name: 'John Student',
      status: 'pending'
    };
    this.isUploadModalOpen = true;
  }

  closeUploadModal() {
    this.isUploadModalOpen = false;
    this.uploadForm = {};
  }

  submitUpload() {
    const newSubmission: SubmissionWithFiles = {
      id: (this.submissions.length + 1).toString(),
      project_id: '1',
      project_title: this.uploadForm.project_title || '',
      title: this.uploadForm.title || '',
      description: this.uploadForm.description,
      type: this.uploadForm.type || 'code',
      created_date: new Date().toISOString().split('T')[0],
      submitted_by: 'student@test.com',
      student_name: 'John Student',
      status: 'pending',
      files: [
        { name: 'submission-file.pdf', size: '1.2 MB', type: 'PDF' }
      ],
      comments: []
    };

    this.submissions.unshift(newSubmission);
    this.filterSubmissions();
    this.closeUploadModal();
  }

  viewSubmission(submission: SubmissionWithFiles) {
    this.selectedSubmission = submission;
    this.gradingForm = {
      grade: submission.grade || 0,
      status: submission.status === 'pending' ? 'approved' : submission.status,
      feedback: submission.feedback || ''
    };
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedSubmission = null;
    this.newComment = '';
  }

  openGradingModal(submission: SubmissionWithFiles) {
    this.viewSubmission(submission);
  }

  saveGrade() {
    if (this.selectedSubmission) {
      const index = this.submissions.findIndex(s => s.id === this.selectedSubmission!.id);
      if (index !== -1) {
        this.submissions[index] = {
          ...this.submissions[index],
          grade: this.gradingForm.grade,
          status: this.gradingForm.status as any,
          feedback: this.gradingForm.feedback
        };
        this.selectedSubmission = this.submissions[index];
        this.filterSubmissions();
      }
    }
  }

  addComment() {
    if (this.newComment.trim() && this.selectedSubmission) {
      const comment = {
        author: (this.authService.getCurrentUser()?.full_name || 'User'),
        text: this.newComment,
        date: new Date().toISOString().split('T')[0]
      };

      const index = this.submissions.findIndex(s => s.id === this.selectedSubmission!.id);
      if (index !== -1) {
        if (!this.submissions[index].comments) {
          this.submissions[index].comments = [];
        }
        this.submissions[index].comments!.push(comment);
        this.selectedSubmission.comments = this.submissions[index].comments;
      }

      this.newComment = '';
    }
  }

  getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'gray' {
    const variants: { [key: string]: 'success' | 'warning' | 'danger' | 'gray' } = {
      'approved': 'success',
      'pending': 'warning',
      'rejected': 'danger',
      'needs_revision': 'gray'
    };
    return variants[status] || 'gray';
  }

  getTypeBadgeVariant(type: string): 'primary' | 'info' | 'success' {
    const variants: { [key: string]: 'primary' | 'info' | 'success' } = {
      'code': 'primary',
      'report': 'info',
      'documentation': 'success'
    };
    return variants[type] || 'primary';
  }

  formatStatus(status: string): string {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  formatDate(dateString?: string | Date): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
