import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Milestone } from '../models/milestone.model';

/**
 * Milestone Service
 * Handles all milestone-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  private readonly entityName = 'Milestone';

  constructor(private base44Service: Base44Service) {}

  list(sortField: string = 'due_date'): Observable<Milestone[]> {
    return this.base44Service.list<Milestone>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Milestone[]> {
    return this.base44Service.filter<Milestone>(this.entityName, filters);
  }

  get(id: string | number): Observable<Milestone> {
    return this.base44Service.get<Milestone>(this.entityName, id);
  }

  create(milestone: Partial<Milestone>): Observable<Milestone> {
    return this.base44Service.create<Milestone>(this.entityName, milestone);
  }

  update(id: string | number, milestone: Partial<Milestone>): Observable<Milestone> {
    return this.base44Service.update<Milestone>(this.entityName, id, milestone);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get milestones for a specific project
   * @param projectId - Project ID
   * @returns Observable<Milestone[]>
   */
  getByProject(projectId: string): Observable<Milestone[]> {
    return this.filter({ project_id: projectId });
  }

  /**
   * Get upcoming milestones
   * @returns Observable<Milestone[]>
   */
  getUpcoming(): Observable<Milestone[]> {
    return this.filter({ status: 'not_started' });
  }
}
