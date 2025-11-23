/**
 * Submission Model
 * Represents a student submission for a project
 */
export interface Submission {
  id?: string;
  project_id: string;
  title: string;
  description?: string;
  type: SubmissionType;
  file_url?: string;
  submitted_by: string;
  status: SubmissionStatus;
  feedback?: string;
  grade?: number;
  due_date?: Date | string;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * Submission type enum
 */
export type SubmissionType =
  | 'report'
  | 'presentation'
  | 'code'
  | 'documentation'
  | 'other';

/**
 * Submission status enum
 */
export type SubmissionStatus =
  | 'pending'
  | 'reviewed'
  | 'approved'
  | 'needs_revision';
