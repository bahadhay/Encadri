import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Meetings</h1>
      <p class="text-gray-600">Meetings page - Coming soon</p>
    </div>
  `
})
export class MeetingsComponent {}
