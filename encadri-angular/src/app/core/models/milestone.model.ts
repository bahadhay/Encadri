/**
 * Milestone Model
 * Represents a project milestone or deliverable
 */
export interface Milestone {
  id?: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: Date | string;
  status: MilestoneStatus;
  completed_date?: Date | string;
  order?: number;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * Milestone status enum
 */
export type MilestoneStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'overdue';
