/**
 * Meeting Model
 * Represents a scheduled meeting between student and supervisor
 */
export interface Meeting {
  id?: string;
  project_id: string;
  title?: string;
  scheduled_at: Date | string;
  duration_minutes?: number;
  location?: string;
  status: MeetingStatus;
  agenda?: string;
  notes?: string;
  requested_by?: string;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * Meeting status enum
 */
export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
