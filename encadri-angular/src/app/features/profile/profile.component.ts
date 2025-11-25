import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

interface ProfileForm {
  full_name: string;
  email: string;
  phone?: string;
  institution?: string;
  department?: string;
  bio?: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface PreferencesForm {
  email_notifications: boolean;
  project_updates: boolean;
  meeting_reminders: boolean;
  deadline_alerts: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, BadgeComponent, AvatarComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p class="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>
      </div>

      <!-- Profile Overview Card -->
      <app-card>
        <div class="flex items-center gap-6">
          <div class="relative">
            <app-avatar
              [src]="avatarUrl"
              [name]="profileForm.full_name"
              size="xl"
              [status]="'online'">
            </app-avatar>
            <button
              (click)="triggerFileInput()"
              class="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              #fileInput
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
              class="hidden"
            />
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900">{{ profileForm.full_name }}</h2>
            <p class="text-gray-600">{{ profileForm.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <app-badge [variant]="getRoleBadge(userRole)" size="sm">
                {{ userRole }}
              </app-badge>
              <app-badge variant="success" size="sm" [dot]="true">
                Active
              </app-badge>
            </div>
          </div>
        </div>
      </app-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Personal Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <app-card title="Personal Information">
            <div cardHeaderAction>
              <app-button
                *ngIf="!isEditingProfile"
                variant="ghost"
                size="sm"
                (click)="enableProfileEdit()"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </app-button>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    [(ngModel)]="profileForm.full_name"
                    [disabled]="!isEditingProfile"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    [(ngModel)]="profileForm.email"
                    [disabled]="!isEditingProfile"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    [(ngModel)]="profileForm.phone"
                    [disabled]="!isEditingProfile"
                    placeholder="+1 (555) 000-0000"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input
                    type="text"
                    [(ngModel)]="profileForm.institution"
                    [disabled]="!isEditingProfile"
                    placeholder="University/Company name"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    [(ngModel)]="profileForm.department"
                    [disabled]="!isEditingProfile"
                    placeholder="Computer Science"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  [(ngModel)]="profileForm.bio"
                  [disabled]="!isEditingProfile"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                ></textarea>
              </div>

              <div *ngIf="isEditingProfile" class="flex gap-3 pt-4 border-t border-gray-200">
                <app-button variant="primary" (click)="saveProfile()">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </app-button>
                <app-button variant="ghost" (click)="cancelProfileEdit()">
                  Cancel
                </app-button>
              </div>
            </div>
          </app-card>

          <!-- Change Password -->
          <app-card title="Change Password">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  [(ngModel)]="passwordForm.current_password"
                  placeholder="Enter current password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  [(ngModel)]="passwordForm.new_password"
                  placeholder="Enter new password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, and numbers</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  [(ngModel)]="passwordForm.confirm_password"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div *ngIf="passwordError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {{ passwordError }}
              </div>

              <div *ngIf="passwordSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {{ passwordSuccess }}
              </div>

              <div class="flex gap-3 pt-4 border-t border-gray-200">
                <app-button variant="primary" (click)="changePassword()">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Update Password
                </app-button>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Right Column - Preferences -->
        <div class="space-y-6">
          <!-- Account Statistics -->
          <app-card title="Account Statistics">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="text-sm font-medium text-gray-900">Jan 2024</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Total Projects</span>
                <span class="text-sm font-medium text-gray-900">5</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Completed</span>
                <span class="text-sm font-medium text-gray-900">2</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">In Progress</span>
                <span class="text-sm font-medium text-gray-900">3</span>
              </div>
            </div>
          </app-card>

          <!-- Notification Preferences -->
          <app-card title="Notifications">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p class="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="preferencesForm.email_notifications"
                    (change)="savePreferences()"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Project Updates</p>
                  <p class="text-xs text-gray-500">Get notified of changes</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="preferencesForm.project_updates"
                    (change)="savePreferences()"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Meeting Reminders</p>
                  <p class="text-xs text-gray-500">Reminders before meetings</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="preferencesForm.meeting_reminders"
                    (change)="savePreferences()"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Deadline Alerts</p>
                  <p class="text-xs text-gray-500">Alerts for upcoming deadlines</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="preferencesForm.deadline_alerts"
                    (change)="savePreferences()"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </app-card>

          <!-- Appearance -->
          <app-card title="Appearance">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  [(ngModel)]="preferencesForm.theme"
                  (change)="savePreferences()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  [(ngModel)]="preferencesForm.language"
                  (change)="savePreferences()"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </app-card>

          <!-- Danger Zone -->
          <app-card>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                <p class="text-sm text-gray-600 mb-4">Irreversible actions that affect your account</p>
              </div>

              <app-button variant="outline" customClass="w-full border-red-300 text-red-600 hover:bg-red-50">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Deactivate Account
              </app-button>

              <app-button variant="outline" customClass="w-full border-red-300 text-red-600 hover:bg-red-50">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </app-button>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  avatarUrl?: string;
  userRole = 'Student';

  isEditingProfile = false;
  profileFormOriginal!: ProfileForm;

  profileForm: ProfileForm = {
    full_name: '',
    email: '',
    phone: '',
    institution: '',
    department: '',
    bio: ''
  };

  passwordForm: PasswordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  preferencesForm: PreferencesForm = {
    email_notifications: true,
    project_updates: true,
    meeting_reminders: true,
    deadline_alerts: true,
    theme: 'light',
    language: 'en'
  };

  passwordError = '';
  passwordSuccess = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Load from AuthService or mock data
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm = {
          full_name: user.full_name || 'John Doe',
          email: user.email || 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          institution: 'Tech University',
          department: 'Computer Science',
          bio: 'Passionate software engineering student interested in full-stack development and machine learning. Currently working on my final year project focusing on AI-powered web applications.'
        };
        this.avatarUrl = user.avatar_url;
        this.userRole = user.user_role === 'supervisor' ? 'Supervisor' : 'Student';
      }
    });

    // Save original for cancel functionality
    this.profileFormOriginal = { ...this.profileForm };
  }

  enableProfileEdit() {
    this.isEditingProfile = true;
    this.profileFormOriginal = { ...this.profileForm };
  }

  saveProfile() {
    // TODO: Implement actual save to backend
    console.log('Saving profile:', this.profileForm);
    this.isEditingProfile = false;
    this.profileFormOriginal = { ...this.profileForm };
  }

  cancelProfileEdit() {
    this.profileForm = { ...this.profileFormOriginal };
    this.isEditingProfile = false;
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.avatarUrl = e.target?.result as string;
        // TODO: Upload to backend
        console.log('Avatar updated:', file.name);
      };

      reader.readAsDataURL(file);
    }
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    // Validation
    if (!this.passwordForm.current_password || !this.passwordForm.new_password || !this.passwordForm.confirm_password) {
      this.passwordError = 'Please fill in all password fields';
      return;
    }

    if (this.passwordForm.new_password.length < 8) {
      this.passwordError = 'New password must be at least 8 characters long';
      return;
    }

    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.passwordError = 'New passwords do not match';
      return;
    }

    // TODO: Implement actual password change to backend
    console.log('Changing password');

    // Simulate success
    this.passwordSuccess = 'Password updated successfully!';
    this.passwordForm = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };

    // Clear success message after 3 seconds
    setTimeout(() => {
      this.passwordSuccess = '';
    }, 3000);
  }

  savePreferences() {
    // TODO: Implement actual save to backend
    console.log('Saving preferences:', this.preferencesForm);
  }

  getRoleBadge(role: string): 'primary' | 'success' | 'info' {
    const badges: { [key: string]: 'primary' | 'success' | 'info' } = {
      'Student': 'primary',
      'Supervisor': 'success',
      'Admin': 'info'
    };
    return badges[role] || 'primary';
  }
}
