/**
 * Message Model
 * Represents a message between student and supervisor in a project
 */
export interface Message {
  id?: string;
  project_id: string;
  sender_email: string;
  sender_name?: string;
  content: string;
  is_read: boolean;
  created_date?: Date | string;
  updated_date?: Date | string;
}
