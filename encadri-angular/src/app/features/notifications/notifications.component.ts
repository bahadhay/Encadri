import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      <p class="text-gray-600">Notifications page - Coming soon</p>
    </div>
  `
})
export class NotificationsComponent {}
