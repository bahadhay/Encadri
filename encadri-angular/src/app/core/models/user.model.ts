/**
 * User Model
 * Represents a system user (student or supervisor)
 */
export interface User {
  id?: string;
  email: string;
  full_name: string;
  user_role: 'student' | 'supervisor';
  avatar_url?: string;
  created_date?: Date | string;
  updated_date?: Date | string;
}

/**
 * User role type
 */
export type UserRole = 'student' | 'supervisor';
