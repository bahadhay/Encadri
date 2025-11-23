/**
 * Notification Model
 * Represents a system notification for a user
 */
export interface Notification {
  id?: string;
  user_email: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link?: string;
  priority: NotificationPriority;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * Notification type enum
 */
export type NotificationType =
  | 'project_status'
  | 'new_assignment'
  | 'deadline'
  | 'feedback'
  | 'meeting'
  | 'message'
  | 'system';

/**
 * Notification priority enum
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
