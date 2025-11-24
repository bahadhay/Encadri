import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Project } from '../models/project.model';

/**
 * Project Service
 * Handles all project-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly entityName = 'Project';

  constructor(private base44Service: Base44Service) {}

  /**
   * List all projects with optional sorting
   * @param sortField - Sort field (default: '-updated_date')
   * @returns Observable<Project[]>
   */
  list(sortField: string = '-updated_date'): Observable<Project[]> {
    return this.base44Service.list<Project>(this.entityName, sortField);
  }

  /**
   * Filter projects by criteria
   * @param filters - Filter criteria
   * @returns Observable<Project[]>
   */
  filter(filters: Record<string, any>): Observable<Project[]> {
    return this.base44Service.filter<Project>(this.entityName, filters);
  }

  /**
   * Get single project by ID
   * @param id - Project ID
   * @returns Observable<Project>
   */
  get(id: string | number): Observable<Project> {
    return this.base44Service.get<Project>(this.entityName, id);
  }

  /**
   * Create new project
   * @param project - Project data
   * @returns Observable<Project>
   */
  create(project: Partial<Project>): Observable<Project> {
    return this.base44Service.create<Project>(this.entityName, project);
  }

  /**
   * Update existing project
   * @param id - Project ID
   * @param project - Updated project data
   * @returns Observable<Project>
   */
  update(id: string | number, project: Partial<Project>): Observable<Project> {
    return this.base44Service.update<Project>(this.entityName, id, project);
  }

  /**
   * Delete project
   * @param id - Project ID
   * @returns Observable<void>
   */
  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get projects for current user based on role
   * @param userEmail - User email
   * @param userRole - User role ('student' | 'supervisor')
   * @returns Observable<Project[]>
   */
  getMyProjects(userEmail: string, userRole: 'student' | 'supervisor'): Observable<Project[]> {
    const filters = userRole === 'student'
      ? { student_email: userEmail }
      : { supervisor_email: userEmail };

    return this.filter(filters);
  }

  /**
   * Get proposed projects (invitations) for a student
   * @param studentEmail - Student email
   * @returns Observable<Project[]>
   */
  getPendingInvitations(studentEmail: string): Observable<Project[]> {
    return this.filter({
      student_email: studentEmail,
      status: 'proposed'
    });
  }

  /**
   * Get active projects for a user
   * @param userEmail - User email
   * @param userRole - User role
   * @returns Observable<Project[]>
   */
  getActiveProjects(userEmail: string, userRole: 'student' | 'supervisor'): Observable<Project[]> {
    const emailField = userRole === 'student' ? 'student_email' : 'supervisor_email';
    return this.filter({
      [emailField]: userEmail,
      status: 'in_progress'
    });
  }
}
