import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Meeting } from '../models/meeting.model';

/**
 * Meeting Service
 * Handles all meeting-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly entityName = 'Meeting';

  constructor(private base44Service: Base44Service) {}

  list(sortField: string = 'scheduled_at'): Observable<Meeting[]> {
    return this.base44Service.list<Meeting>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Meeting[]> {
    return this.base44Service.filter<Meeting>(this.entityName, filters);
  }

  get(id: string | number): Observable<Meeting> {
    return this.base44Service.get<Meeting>(this.entityName, id);
  }

  create(meeting: Partial<Meeting>): Observable<Meeting> {
    return this.base44Service.create<Meeting>(this.entityName, meeting);
  }

  update(id: string | number, meeting: Partial<Meeting>): Observable<Meeting> {
    return this.base44Service.update<Meeting>(this.entityName, id, meeting);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get meetings for a specific project
   * @param projectId - Project ID
   * @returns Observable<Meeting[]>
   */
  getByProject(projectId: string): Observable<Meeting[]> {
    return this.filter({ project_id: projectId });
  }

  /**
   * Get upcoming meetings
   * @returns Observable<Meeting[]>
   */
  getUpcoming(): Observable<Meeting[]> {
    return this.filter({ status: 'confirmed' });
  }

  /**
   * Get pending meeting requests
   * @returns Observable<Meeting[]>
   */
  getPending(): Observable<Meeting[]> {
    return this.filter({ status: 'pending' });
  }
}
