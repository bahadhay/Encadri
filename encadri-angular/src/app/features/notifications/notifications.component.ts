import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notification } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Notifications</h1>
          <p class="text-gray-600 mt-2">Stay updated with your project activities</p>
        </div>
        <app-button
          variant="outline"
          (click)="markAllAsRead()"
          [disabled]="unreadCount === 0">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mark All as Read
        </app-button>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <app-card>
          <div class="flex items-center gap-3">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ notifications.length }}</p>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center gap-3">
            <div class="p-3 bg-indigo-100 rounded-lg">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Unread</p>
              <p class="text-2xl font-bold text-indigo-600">{{ unreadCount }}</p>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center gap-3">
            <div class="p-3 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Urgent</p>
              <p class="text-2xl font-bold text-red-600">{{ urgentCount }}</p>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <select
              [(ngModel)]="filterType"
              (ngModelChange)="filterNotifications()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Types</option>
              <option value="project_status">Project Status</option>
              <option value="new_assignment">New Assignment</option>
              <option value="deadline">Deadline</option>
              <option value="feedback">Feedback</option>
              <option value="meeting">Meeting</option>
              <option value="message">Message</option>
              <option value="system">System</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
            <select
              [(ngModel)]="filterPriority"
              (ngModelChange)="filterNotifications()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              [(ngModel)]="filterStatus"
              (ngModelChange)="filterNotifications()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Notifications List -->
      <div class="space-y-3">
        <div
          *ngFor="let notification of filteredNotifications"
          class="group"
          (click)="markAsRead(notification)">
          <app-card
            [clickable]="true"
            [customClass]="!notification.is_read ? 'bg-indigo-50 border-indigo-200 hover:border-indigo-300' : 'hover:border-gray-300'">
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div
                [class]="'p-3 rounded-lg ' + getNotificationIconBg(notification.type)">
                <span
                  [innerHTML]="getNotificationIcon(notification.type)"
                  [class]="'w-6 h-6 ' + getNotificationIconColor(notification.type)"></span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4 mb-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3
                        [class]="'text-base font-semibold ' + (!notification.is_read ? 'text-gray-900' : 'text-gray-700')">
                        {{ notification.title }}
                      </h3>
                      <app-badge
                        *ngIf="!notification.is_read"
                        variant="primary"
                        size="sm">
                        New
                      </app-badge>
                      <app-badge
                        [variant]="getPriorityBadgeVariant(notification.priority)"
                        size="sm"
                        *ngIf="notification.priority === 'urgent' || notification.priority === 'high'">
                        {{ notification.priority | titlecase }}
                      </app-badge>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDate(notification.created_date) }}
                      </span>
                      <app-badge
                        [variant]="getTypeBadgeVariant(notification.type)"
                        size="sm">
                        {{ formatType(notification.type) }}
                      </app-badge>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-col gap-2">
                    <button
                      *ngIf="!notification.is_read"
                      (click)="markAsRead(notification); $event.stopPropagation()"
                      class="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                      Mark as Read
                    </button>
                    <button
                      *ngIf="notification.link"
                      (click)="$event.stopPropagation()"
                      class="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Empty State -->
        <app-card *ngIf="filteredNotifications.length === 0">
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p class="text-gray-600">You're all caught up!</p>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  filterType = '';
  filterPriority = '';
  filterStatus = '';

  unreadCount = 0;
  urgentCount = 0;

  ngOnInit() {
    this.loadMockNotifications();
    this.filterNotifications();
    this.updateCounts();
  }

  loadMockNotifications() {
    this.notifications = [
      {
        id: '1',
        user_email: 'student@test.com',
        title: 'Project Deadline Approaching',
        message: 'Your E-Commerce Platform project submission is due in 3 days. Please ensure all deliverables are ready.',
        type: 'deadline',
        is_read: false,
        link: '/projects/1',
        priority: 'urgent',
        created_date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        user_email: 'student@test.com',
        title: 'New Feedback on Your Submission',
        message: 'Dr. Sarah Supervisor has provided feedback on your Sprint 1 UI Components submission. Grade: 18.5/20',
        type: 'feedback',
        is_read: false,
        link: '/submissions/1',
        priority: 'high',
        created_date: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        id: '3',
        user_email: 'student@test.com',
        title: 'Upcoming Meeting Reminder',
        message: 'Project Review Meeting is scheduled for tomorrow at 10:00 AM in Conference Room A.',
        type: 'meeting',
        is_read: false,
        link: '/meetings/1',
        priority: 'high',
        created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '4',
        user_email: 'student@test.com',
        title: 'New Message from Supervisor',
        message: 'You have a new message regarding the technical architecture review. Please check your messages.',
        type: 'message',
        is_read: true,
        link: '/messages',
        priority: 'normal',
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: '5',
        user_email: 'student@test.com',
        title: 'Project Status Updated',
        message: 'Your Mobile Banking App project status has been updated to "In Progress". Keep up the good work!',
        type: 'project_status',
        is_read: true,
        link: '/projects/2',
        priority: 'normal',
        created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: '6',
        user_email: 'student@test.com',
        title: 'New Project Assignment',
        message: 'You have been assigned to the AI-Powered Chatbot Integration project as a team member.',
        type: 'new_assignment',
        is_read: true,
        link: '/projects/3',
        priority: 'high',
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        id: '7',
        user_email: 'student@test.com',
        title: 'System Maintenance Notice',
        message: 'The platform will undergo scheduled maintenance on Saturday from 2:00 AM to 4:00 AM. Please save your work.',
        type: 'system',
        is_read: true,
        link: undefined,
        priority: 'low',
        created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: '8',
        user_email: 'student@test.com',
        title: 'Submission Approved',
        message: 'Your Database Schema Design submission has been approved. Well done!',
        type: 'feedback',
        is_read: true,
        link: '/submissions/4',
        priority: 'normal',
        created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        id: '9',
        user_email: 'student@test.com',
        title: 'Meeting Cancelled',
        message: 'The Stakeholder Presentation meeting scheduled for May 15 has been cancelled. A new date will be announced soon.',
        type: 'meeting',
        is_read: true,
        link: '/meetings/6',
        priority: 'normal',
        created_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      },
      {
        id: '10',
        user_email: 'student@test.com',
        title: 'Weekly Progress Report Due',
        message: 'Don\'t forget to submit your weekly progress report by Friday 5:00 PM.',
        type: 'deadline',
        is_read: false,
        link: '/submissions',
        priority: 'normal',
        created_date: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];
  }

  filterNotifications() {
    this.filteredNotifications = this.notifications.filter(notification => {
      const matchesType = !this.filterType || notification.type === this.filterType;
      const matchesPriority = !this.filterPriority || notification.priority === this.filterPriority;
      const matchesStatus = !this.filterStatus ||
        (this.filterStatus === 'unread' && !notification.is_read) ||
        (this.filterStatus === 'read' && notification.is_read);

      return matchesType && matchesPriority && matchesStatus;
    });

    // Sort by date (newest first)
    this.filteredNotifications.sort((a, b) => {
      const dateA = a.created_date instanceof Date ? a.created_date : new Date(a.created_date!);
      const dateB = b.created_date instanceof Date ? b.created_date : new Date(b.created_date!);
      return dateB.getTime() - dateA.getTime();
    });

    this.updateCounts();
  }

  updateCounts() {
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
    this.urgentCount = this.notifications.filter(n => n.priority === 'urgent').length;
  }

  markAsRead(notification: Notification) {
    if (!notification.is_read) {
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.notifications[index].is_read = true;
        this.filterNotifications();
      }
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.is_read = true);
    this.filterNotifications();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Unknown';

    const notificationDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return notificationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  formatType(type: string): string {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'project_status': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      'new_assignment': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
      'deadline': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      'feedback': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>',
      'meeting': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
      'message': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
      'system': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
    };
    return icons[type] || icons['system'];
  }

  getNotificationIconColor(type: string): string {
    const colors: { [key: string]: string } = {
      'project_status': 'text-green-600',
      'new_assignment': 'text-blue-600',
      'deadline': 'text-red-600',
      'feedback': 'text-purple-600',
      'meeting': 'text-indigo-600',
      'message': 'text-yellow-600',
      'system': 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  }

  getNotificationIconBg(type: string): string {
    const backgrounds: { [key: string]: string } = {
      'project_status': 'bg-green-100',
      'new_assignment': 'bg-blue-100',
      'deadline': 'bg-red-100',
      'feedback': 'bg-purple-100',
      'meeting': 'bg-indigo-100',
      'message': 'bg-yellow-100',
      'system': 'bg-gray-100'
    };
    return backgrounds[type] || 'bg-gray-100';
  }

  getPriorityBadgeVariant(priority: string): 'danger' | 'warning' | 'info' | 'gray' {
    const variants: { [key: string]: 'danger' | 'warning' | 'info' | 'gray' } = {
      'urgent': 'danger',
      'high': 'warning',
      'normal': 'info',
      'low': 'gray'
    };
    return variants[priority] || 'gray';
  }

  getTypeBadgeVariant(type: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'gray' {
    const variants: { [key: string]: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'gray' } = {
      'project_status': 'success',
      'new_assignment': 'primary',
      'deadline': 'danger',
      'feedback': 'info',
      'meeting': 'warning',
      'message': 'info',
      'system': 'gray'
    };
    return variants[type] || 'gray';
  }
}
