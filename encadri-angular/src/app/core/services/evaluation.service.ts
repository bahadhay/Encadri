import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Base44Service } from './base44.service';
import { Evaluation } from '../models/evaluation.model';

/**
 * Evaluation Service
 * Handles all evaluation-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly entityName = 'Evaluation';

  constructor(private base44Service: Base44Service) {}

  list(sortField: string = '-created_date'): Observable<Evaluation[]> {
    return this.base44Service.list<Evaluation>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Evaluation[]> {
    return this.base44Service.filter<Evaluation>(this.entityName, filters);
  }

  get(id: string | number): Observable<Evaluation> {
    return this.base44Service.get<Evaluation>(this.entityName, id);
  }

  create(evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.base44Service.create<Evaluation>(this.entityName, evaluation);
  }

  update(id: string | number, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.base44Service.update<Evaluation>(this.entityName, id, evaluation);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get evaluation for a specific project
   * @param projectId - Project ID
   * @returns Observable<Evaluation | null>
   */
  getByProject(projectId: string): Observable<Evaluation[]> {
    return this.filter({ project_id: projectId });
  }

  /**
   * Get evaluations by evaluator
   * @param evaluatorEmail - Evaluator email
   * @returns Observable<Evaluation[]>
   */
  getByEvaluator(evaluatorEmail: string): Observable<Evaluation[]> {
    return this.filter({ evaluator_email: evaluatorEmail });
  }
}
