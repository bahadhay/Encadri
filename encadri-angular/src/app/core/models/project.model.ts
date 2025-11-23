/**
 * Project Model
 * Represents an academic project (PFA, PFE, or Internship)
 */
export interface Project {
  id?: string;
  title: string;
  type: ProjectType;
  description?: string;
  student_email: string;
  student_name?: string;
  supervisor_email: string;
  supervisor_name?: string;
  status: ProjectStatus;
  start_date?: Date | string;
  end_date?: Date | string;
  company?: string;
  technologies?: string[];
  objectives?: string[];
  final_grade?: number;
  progress_percentage?: number;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * Project type enum
 */
export type ProjectType = 'PFA' | 'PFE' | 'Internship';

/**
 * Project status enum
 */
export type ProjectStatus =
  | 'proposed'
  | 'in_progress'
  | 'under_review'
  | 'completed'
  | 'archived';
