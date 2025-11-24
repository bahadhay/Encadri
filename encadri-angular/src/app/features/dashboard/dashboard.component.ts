import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface RecentProject {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface UpcomingMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, BadgeComponent, AvatarComponent, ButtonComponent],
  template: `
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Welcome back, {{ (authService.currentUser$ | async)?.full_name || 'User' }}</p>
        </div>
        <app-avatar
          [src]="(authService.currentUser$ | async)?.avatar_url"
          [name]="(authService.currentUser$ | async)?.full_name || 'User'"
          size="lg"
          status="online">
        </app-avatar>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-card *ngFor="let stat of stats" [clickable]="true" customClass="hover:border-indigo-200">
          <div class="flex items-center gap-4">
            <div [class]="'p-3 rounded-lg ' + stat.bgColor">
              <span [innerHTML]="stat.icon" [class]="'w-6 h-6 ' + stat.color"></span>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
          </div>
        </app-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Projects -->
        <div class="lg:col-span-2">
          <app-card title="Recent Projects">
            <div cardHeaderAction>
              <app-button variant="ghost" size="sm" [routerLink]="['/projects']">
                View All
              </app-button>
            </div>

            <div class="space-y-4">
              <div *ngFor="let project of recentProjects" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ project.title }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <app-badge [variant]="getProjectTypeBadgeVariant(project.type)" size="sm">
                        {{ project.type }}
                      </app-badge>
                      <app-badge [variant]="getStatusBadgeVariant(project.status)" size="sm" [dot]="true">
                        {{ project.status }}
                      </app-badge>
                    </div>
                  </div>
                  <span class="text-sm text-gray-500">Due {{ project.dueDate }}</span>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3">
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-medium text-gray-900">{{ project.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-gradient-to-r from-indigo-600 to-indigo-700 h-2 rounded-full transition-all"
                      [style.width.%]="project.progress">
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="recentProjects.length === 0" class="text-center py-8 text-gray-500">
                No projects yet. Create your first project!
              </div>
            </div>
          </app-card>
        </div>

        <!-- Upcoming Meetings -->
        <div>
          <app-card title="Upcoming Meetings">
            <div cardHeaderAction>
              <app-button variant="ghost" size="sm" [routerLink]="['/meetings']">
                View All
              </app-button>
            </div>

            <div class="space-y-3">
              <div *ngFor="let meeting of upcomingMeetings" class="p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-200">
                <h4 class="font-medium text-gray-900 mb-2">{{ meeting.title }}</h4>
                <div class="space-y-1 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ meeting.date }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ meeting.time }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{{ meeting.participants }} participants</span>
                  </div>
                </div>
              </div>

              <div *ngIf="upcomingMeetings.length === 0" class="text-center py-8 text-gray-500 text-sm">
                No upcoming meetings
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <app-card title="Quick Actions">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <app-button variant="outline" [routerLink]="['/projects']" customClass="justify-start">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </app-button>

          <app-button variant="outline" [routerLink]="['/submissions']" customClass="justify-start">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Work
          </app-button>

          <app-button variant="outline" [routerLink]="['/meetings']" customClass="justify-start">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Meeting
          </app-button>

          <app-button variant="outline" [routerLink]="['/notifications']" customClass="justify-start">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            View Alerts
          </app-button>
        </div>
      </app-card>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [
    {
      title: 'Total Projects',
      value: 5,
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Completed',
      value: 2,
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: 3,
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Notifications',
      value: 8,
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  recentProjects: RecentProject[] = [
    {
      id: '1',
      title: 'E-Commerce Platform Redesign',
      type: 'PFE',
      status: 'In Progress',
      progress: 65,
      dueDate: 'Jun 15, 2024'
    },
    {
      id: '2',
      title: 'Mobile Banking App Development',
      type: 'PFA',
      status: 'In Progress',
      progress: 45,
      dueDate: 'May 28, 2024'
    },
    {
      id: '3',
      title: 'AI-Powered Chatbot Integration',
      type: 'Internship',
      status: 'Under Review',
      progress: 90,
      dueDate: 'May 10, 2024'
    }
  ];

  upcomingMeetings: UpcomingMeeting[] = [
    {
      id: '1',
      title: 'Project Review Meeting',
      date: 'May 15, 2024',
      time: '10:00 AM',
      participants: 4
    },
    {
      id: '2',
      title: 'Sprint Planning',
      date: 'May 16, 2024',
      time: '2:00 PM',
      participants: 6
    },
    {
      id: '3',
      title: 'Weekly Sync with Supervisor',
      date: 'May 18, 2024',
      time: '11:00 AM',
      participants: 2
    }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Mock data is already loaded in component properties
  }

  getProjectTypeBadgeVariant(type: string): 'primary' | 'success' | 'info' {
    const variants: { [key: string]: 'primary' | 'success' | 'info' } = {
      'PFE': 'primary',
      'PFA': 'success',
      'Internship': 'info'
    };
    return variants[type] || 'primary';
  }

  getStatusBadgeVariant(status: string): 'success' | 'warning' | 'info' | 'gray' {
    const variants: { [key: string]: 'success' | 'warning' | 'info' | 'gray' } = {
      'Completed': 'success',
      'In Progress': 'warning',
      'Under Review': 'info',
      'Proposed': 'gray'
    };
    return variants[status] || 'gray';
  }
}
