import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Submission } from '../models/submission.model';

/**
 * Submission Service
 * Handles all submission-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private readonly entityName = 'Submission';

  constructor(private base44Service: Base44Service) {}

  list(sortField: string = '-created_date'): Observable<Submission[]> {
    return this.base44Service.list<Submission>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Submission[]> {
    return this.base44Service.filter<Submission>(this.entityName, filters);
  }

  get(id: string | number): Observable<Submission> {
    return this.base44Service.get<Submission>(this.entityName, id);
  }

  create(submission: Partial<Submission>): Observable<Submission> {
    return this.base44Service.create<Submission>(this.entityName, submission);
  }

  update(id: string | number, submission: Partial<Submission>): Observable<Submission> {
    return this.base44Service.update<Submission>(this.entityName, id, submission);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get submissions for a specific project
   * @param projectId - Project ID
   * @returns Observable<Submission[]>
   */
  getByProject(projectId: string): Observable<Submission[]> {
    return this.filter({ project_id: projectId });
  }

  /**
   * Get submissions by student
   * @param studentEmail - Student email
   * @returns Observable<Submission[]>
   */
  getByStudent(studentEmail: string): Observable<Submission[]> {
    return this.filter({ submitted_by: studentEmail });
  }
}
