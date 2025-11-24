import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { Meeting } from '../../core/models';

interface MeetingWithProject extends Meeting {
  project_title?: string;
  organizer_name?: string;
  participants_details?: { name: string; email: string; avatar?: string }[];
}

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    InputComponent
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Meetings</h1>
          <p class="text-gray-600 mt-2">Manage project meetings and schedules</p>
        </div>
        <app-button (click)="openCreateModal()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule Meeting
        </app-button>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterMeetings()"
              placeholder="Search meetings..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <select
              [(ngModel)]="filterStatus"
              (ngModelChange)="filterMeetings()"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Meetings List -->
      <div class="space-y-4">
        <div *ngFor="let meeting of filteredMeetings" class="group">
          <app-card [clickable]="true" customClass="hover:border-indigo-200 transition-all">
            <div class="flex items-start justify-between gap-4">
              <!-- Meeting Info -->
              <div class="flex-1 space-y-3">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ meeting.title }}</h3>
                      <app-badge [variant]="getStatusBadgeVariant(meeting.status)" size="sm">
                        {{ meeting.status | titlecase }}
                      </app-badge>
                    </div>
                    <p class="text-sm text-gray-600 mb-2" *ngIf="meeting.project_title">
                      Project: <span class="font-medium">{{ meeting.project_title }}</span>
                    </p>
                  </div>
                </div>

                <!-- Meeting Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <!-- Date & Time -->
                  <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(meeting.scheduled_at) }}</span>
                  </div>

                  <!-- Duration -->
                  <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ meeting.duration_minutes }} minutes</span>
                  </div>

                  <!-- Location -->
                  <div class="flex items-center gap-2 text-gray-600" *ngIf="meeting.location">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ meeting.location }}</span>
                  </div>

                  <!-- Participants -->
                  <div class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{{ meeting.participants_details?.length || 0 }} participants</span>
                  </div>
                </div>

                <!-- Agenda Preview -->
                <div *ngIf="meeting.agenda" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span class="font-medium text-gray-700">Agenda:</span>
                  {{ meeting.agenda.substring(0, 100) }}{{ meeting.agenda.length > 100 ? '...' : '' }}
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2">
                <app-button variant="outline" size="sm" (click)="viewMeeting(meeting)">
                  View Details
                </app-button>
                <app-button
                  variant="ghost"
                  size="sm"
                  (click)="editMeeting(meeting)"
                  *ngIf="meeting.status !== 'completed' && meeting.status !== 'cancelled'">
                  Edit
                </app-button>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Empty State -->
        <app-card *ngIf="filteredMeetings.length === 0">
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p class="text-gray-600 mb-4">Get started by scheduling your first meeting</p>
            <app-button (click)="openCreateModal()">Schedule Meeting</app-button>
          </div>
        </app-card>
      </div>

      <!-- Create/Edit Meeting Modal -->
      <app-modal
        [isOpen]="isModalOpen"
        [title]="isEditMode ? 'Edit Meeting' : 'Schedule New Meeting'"
        size="lg"
        (close)="closeModal()">
        <div class="space-y-4">
          <!-- Title -->
          <app-input
            label="Meeting Title"
            [(ngModel)]="formData.title"
            placeholder="Enter meeting title"
            [required]="true">
          </app-input>

          <!-- Project Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              [(ngModel)]="formData.project_id"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select a project</option>
              <option value="1">E-Commerce Platform Redesign</option>
              <option value="2">Mobile Banking App Development</option>
              <option value="3">AI-Powered Chatbot Integration</option>
              <option value="4">IoT Smart Home System</option>
              <option value="5">Blockchain Supply Chain</option>
            </select>
          </div>

          <!-- Date and Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-input
              label="Date"
              type="datetime-local"
              [(ngModel)]="formData.scheduled_at"
              [required]="true">
            </app-input>

            <app-input
              label="Duration (minutes)"
              type="number"
              [(ngModel)]="formData.duration_minutes"
              placeholder="60"
              [required]="true">
            </app-input>
          </div>

          <!-- Location -->
          <app-input
            label="Location"
            [(ngModel)]="formData.location"
            placeholder="e.g., Conference Room A, Zoom Link, etc."
            [required]="true">
          </app-input>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              [(ngModel)]="formData.status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Agenda -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
            <textarea
              [(ngModel)]="formData.agenda"
              rows="4"
              placeholder="Enter meeting agenda and topics to discuss..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>

          <!-- Participants -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Participants
              <span class="text-gray-500 font-normal">(Add emails separated by commas)</span>
            </label>
            <textarea
              [(ngModel)]="participantsInput"
              rows="2"
              placeholder="john@example.com, jane@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3" footer>
          <app-button variant="outline" (click)="closeModal()">Cancel</app-button>
          <app-button (click)="saveMeeting()">
            {{ isEditMode ? 'Update Meeting' : 'Schedule Meeting' }}
          </app-button>
        </div>
      </app-modal>

      <!-- View Meeting Details Modal -->
      <app-modal
        [isOpen]="isViewModalOpen"
        [title]="selectedMeeting?.title || 'Meeting Details'"
        size="lg"
        (close)="closeViewModal()">
        <div *ngIf="selectedMeeting" class="space-y-6">
          <!-- Status and Project -->
          <div class="flex items-center gap-3 pb-4 border-b">
            <app-badge [variant]="getStatusBadgeVariant(selectedMeeting.status)">
              {{ selectedMeeting.status | titlecase }}
            </app-badge>
            <span class="text-sm text-gray-600" *ngIf="selectedMeeting.project_title">
              {{ selectedMeeting.project_title }}
            </span>
          </div>

          <!-- Meeting Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Date & Time</label>
              <p class="mt-1 text-gray-900">{{ formatDate(selectedMeeting.scheduled_at) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Duration</label>
              <p class="mt-1 text-gray-900">{{ selectedMeeting.duration_minutes }} minutes</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Location</label>
              <p class="mt-1 text-gray-900">{{ selectedMeeting.location || 'Not specified' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Organized By</label>
              <p class="mt-1 text-gray-900">{{ selectedMeeting.organizer_name || 'Not specified' }}</p>
            </div>
          </div>

          <!-- Agenda -->
          <div *ngIf="selectedMeeting.agenda">
            <label class="text-sm font-medium text-gray-500">Agenda</label>
            <div class="mt-2 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">{{ selectedMeeting.agenda }}</div>
          </div>

          <!-- Participants -->
          <div *ngIf="selectedMeeting.participants_details && selectedMeeting.participants_details.length > 0">
            <label class="text-sm font-medium text-gray-500 mb-3 block">
              Participants ({{ selectedMeeting.participants_details.length }})
            </label>
            <div class="space-y-2">
              <div
                *ngFor="let participant of selectedMeeting.participants_details"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                  {{ getInitials(participant.name) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ participant.name }}</p>
                  <p class="text-sm text-gray-600">{{ participant.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div *ngIf="selectedMeeting.notes">
            <label class="text-sm font-medium text-gray-500">Meeting Notes</label>
            <div class="mt-2 p-4 bg-blue-50 rounded-lg text-gray-900 whitespace-pre-wrap">{{ selectedMeeting.notes }}</div>
          </div>
        </div>

        <div class="flex justify-between" footer>
          <app-button
            variant="danger"
            (click)="cancelMeeting()"
            *ngIf="selectedMeeting && selectedMeeting.status !== 'completed' && selectedMeeting.status !== 'cancelled'">
            Cancel Meeting
          </app-button>
          <div class="flex gap-3 ml-auto">
            <app-button variant="outline" (click)="closeViewModal()">Close</app-button>
            <app-button
              (click)="editMeeting(selectedMeeting!)"
              *ngIf="selectedMeeting && selectedMeeting.status !== 'completed' && selectedMeeting.status !== 'cancelled'">
              Edit Meeting
            </app-button>
          </div>
        </div>
      </app-modal>
    </div>
  `
})
export class MeetingsComponent implements OnInit {
  meetings: MeetingWithProject[] = [];
  filteredMeetings: MeetingWithProject[] = [];

  searchQuery = '';
  filterStatus = '';

  isModalOpen = false;
  isViewModalOpen = false;
  isEditMode = false;
  selectedMeeting: MeetingWithProject | null = null;

  formData: Partial<MeetingWithProject> = {
    title: '',
    project_id: '',
    scheduled_at: '',
    duration_minutes: 60,
    location: '',
    status: 'pending',
    agenda: '',
    notes: ''
  };

  participantsInput = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadMockMeetings();
    this.filterMeetings();
  }

  loadMockMeetings() {
    this.meetings = [
      {
        id: '1',
        title: 'Project Kickoff Meeting',
        project_id: '1',
        project_title: 'E-Commerce Platform Redesign',
        scheduled_at: '2024-06-01T10:00:00',
        duration_minutes: 90,
        location: 'Conference Room A',
        status: 'confirmed',
        agenda: 'Welcome and introductions\nProject overview and objectives\nTeam roles and responsibilities\nTimeline and milestones discussion\nQ&A session',
        organizer_name: 'Dr. Sarah Supervisor',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' },
          { name: 'Mark Wilson', email: 'mark@example.com' }
        ]
      },
      {
        id: '2',
        title: 'Sprint Planning Session',
        project_id: '2',
        project_title: 'Mobile Banking App Development',
        scheduled_at: '2024-06-05T14:00:00',
        duration_minutes: 120,
        location: 'https://zoom.us/j/123456789',
        status: 'confirmed',
        agenda: 'Review previous sprint outcomes\nDefine sprint goals and objectives\nBreak down user stories\nEstimate story points\nAssign tasks to team members',
        organizer_name: 'John Student',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' },
          { name: 'Emily Davis', email: 'emily@example.com' },
          { name: 'Alex Johnson', email: 'alex@example.com' }
        ]
      },
      {
        id: '3',
        title: 'Technical Architecture Review',
        project_id: '3',
        project_title: 'AI-Powered Chatbot Integration',
        scheduled_at: '2024-06-10T09:00:00',
        duration_minutes: 60,
        location: 'Conference Room B',
        status: 'pending',
        agenda: 'Present system architecture design\nDiscuss technology stack choices\nReview scalability considerations\nAddress security concerns\nGet feedback and approval',
        organizer_name: 'Dr. Sarah Supervisor',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' },
          { name: 'Prof. David Chen', email: 'david@example.com' }
        ]
      },
      {
        id: '4',
        title: 'Mid-Project Progress Review',
        project_id: '1',
        project_title: 'E-Commerce Platform Redesign',
        scheduled_at: '2024-05-20T15:00:00',
        duration_minutes: 90,
        location: 'Conference Room A',
        status: 'completed',
        agenda: 'Progress update presentation\nDemo of completed features\nDiscuss challenges and blockers\nReview timeline and adjust if needed\nNext steps planning',
        notes: 'Great progress on the UI components. Team successfully delivered Sprint 1 objectives ahead of schedule. Minor adjustments needed for mobile responsiveness. Next sprint will focus on backend API integration.',
        organizer_name: 'Dr. Sarah Supervisor',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' },
          { name: 'Mark Wilson', email: 'mark@example.com' }
        ]
      },
      {
        id: '5',
        title: 'Weekly Sync',
        project_id: '2',
        project_title: 'Mobile Banking App Development',
        scheduled_at: '2024-06-12T11:00:00',
        duration_minutes: 30,
        location: 'https://meet.google.com/abc-defg-hij',
        status: 'confirmed',
        agenda: 'Quick status update from each team member\nBlockers discussion\nUpcoming deadlines reminder',
        organizer_name: 'John Student',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' }
        ]
      },
      {
        id: '6',
        title: 'Stakeholder Presentation',
        project_id: '4',
        project_title: 'IoT Smart Home System',
        scheduled_at: '2024-05-15T13:00:00',
        duration_minutes: 60,
        location: 'Main Auditorium',
        status: 'cancelled',
        agenda: 'Present project to company stakeholders\nDemo current prototype\nDiscuss future roadmap',
        notes: 'Cancelled due to stakeholder availability. Will be rescheduled.',
        organizer_name: 'Dr. Sarah Supervisor',
        participants_details: [
          { name: 'John Student', email: 'john@example.com' },
          { name: 'Dr. Sarah Supervisor', email: 'sarah@example.com' },
          { name: 'Company Representatives', email: 'contact@company.com' }
        ]
      }
    ];
  }

  filterMeetings() {
    this.filteredMeetings = this.meetings.filter(meeting => {
      const matchesSearch = !this.searchQuery ||
        meeting.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        meeting.project_title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = !this.filterStatus || meeting.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort by date (upcoming first)
    this.filteredMeetings.sort((a, b) => {
      const dateA = typeof a.scheduled_at === 'string' ? new Date(a.scheduled_at) : a.scheduled_at;
      const dateB = typeof b.scheduled_at === 'string' ? new Date(b.scheduled_at) : b.scheduled_at;
      return dateA.getTime() - dateB.getTime();
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.formData = {
      title: '',
      project_id: '',
      scheduled_at: '',
      duration_minutes: 60,
      location: '',
      status: 'pending',
      agenda: '',
      notes: ''
    };
    this.participantsInput = '';
  }

  editMeeting(meeting: MeetingWithProject) {
    this.isEditMode = true;
    this.isModalOpen = true;
    this.isViewModalOpen = false;
    this.formData = { ...meeting };

    // Convert participants to comma-separated emails
    if (meeting.participants_details) {
      this.participantsInput = meeting.participants_details.map(p => p.email).join(', ');
    }
  }

  viewMeeting(meeting: MeetingWithProject) {
    this.selectedMeeting = meeting;
    this.isViewModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.formData = {
      title: '',
      project_id: '',
      scheduled_at: '',
      duration_minutes: 60,
      location: '',
      status: 'pending',
      agenda: '',
      notes: ''
    };
    this.participantsInput = '';
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedMeeting = null;
  }

  saveMeeting() {
    if (!this.formData.title || !this.formData.scheduled_at) {
      alert('Please fill in all required fields');
      return;
    }

    // Parse participants
    const participants: { name: string; email: string }[] = [];
    if (this.participantsInput) {
      const emails = this.participantsInput.split(',').map(e => e.trim()).filter(e => e.length > 0);
      emails.forEach(email => {
        participants.push({
          name: email.split('@')[0],
          email: email
        });
      });
    }

    // Get project title
    const projectTitles: { [key: string]: string } = {
      '1': 'E-Commerce Platform Redesign',
      '2': 'Mobile Banking App Development',
      '3': 'AI-Powered Chatbot Integration',
      '4': 'IoT Smart Home System',
      '5': 'Blockchain Supply Chain'
    };

    if (this.isEditMode) {
      const index = this.meetings.findIndex(m => m.id === this.formData.id);
      if (index !== -1) {
        this.meetings[index] = {
          ...this.meetings[index],
          ...this.formData,
          project_title: this.formData.project_id ? projectTitles[this.formData.project_id] : undefined,
          participants_details: participants.length > 0 ? participants : this.meetings[index].participants_details,
          organizer_name: this.authService.getCurrentUser()?.full_name || 'Current User'
        } as MeetingWithProject;
      }
    } else {
      const newMeeting: MeetingWithProject = {
        id: (this.meetings.length + 1).toString(),
        title: this.formData.title!,
        project_id: this.formData.project_id || '',
        project_title: this.formData.project_id ? projectTitles[this.formData.project_id] : undefined,
        scheduled_at: this.formData.scheduled_at!,
        duration_minutes: this.formData.duration_minutes || 60,
        location: this.formData.location,
        status: this.formData.status as any || 'pending',
        agenda: this.formData.agenda,
        notes: this.formData.notes,
        organizer_name: this.authService.getCurrentUser()?.full_name || 'Current User',
        participants_details: participants
      };
      this.meetings.push(newMeeting);
    }

    this.filterMeetings();
    this.closeModal();
  }

  cancelMeeting() {
    if (this.selectedMeeting && confirm('Are you sure you want to cancel this meeting?')) {
      const index = this.meetings.findIndex(m => m.id === this.selectedMeeting!.id);
      if (index !== -1) {
        this.meetings[index].status = 'cancelled';
        this.selectedMeeting.status = 'cancelled';
        this.filterMeetings();
      }
    }
  }

  formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeVariant(status: string): 'success' | 'warning' | 'info' | 'danger' | 'gray' {
    const variants: { [key: string]: 'success' | 'warning' | 'info' | 'danger' | 'gray' } = {
      'confirmed': 'success',
      'pending': 'warning',
      'completed': 'info',
      'cancelled': 'danger'
    };
    return variants[status] || 'gray';
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
