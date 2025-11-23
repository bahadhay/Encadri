/**
 * Evaluation Model
 * Represents a project evaluation by a supervisor
 */
export interface Evaluation {
  id?: string;
  project_id: string;
  evaluator_email: string;
  evaluator_name?: string;
  report_quality_score?: number;
  technical_implementation_score?: number;
  presentation_score?: number;
  professional_conduct_score?: number;
  final_grade?: number;
  comments?: string;
  defense_date?: Date | string;
  created_date?: Date | string;
  updated_date?: Date | string;
}
