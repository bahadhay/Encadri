import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Base44Service } from './base44.service';
import { Message } from '../models/message.model';

/**
 * Message Service
 * Handles all message-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly entityName = 'Message';

  constructor(private base44Service: Base44Service) {}

  list(sortField: string = '-created_date'): Observable<Message[]> {
    return this.base44Service.list<Message>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Message[]> {
    return this.base44Service.filter<Message>(this.entityName, filters);
  }

  get(id: string | number): Observable<Message> {
    return this.base44Service.get<Message>(this.entityName, id);
  }

  create(message: Partial<Message>): Observable<Message> {
    return this.base44Service.create<Message>(this.entityName, message);
  }

  update(id: string | number, message: Partial<Message>): Observable<Message> {
    return this.base44Service.update<Message>(this.entityName, id, message);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get messages for a specific project
   * @param projectId - Project ID
   * @returns Observable<Message[]>
   */
  getByProject(projectId: string): Observable<Message[]> {
    return this.filter({ project_id: projectId });
  }

  /**
   * Get unread messages count for a project
   * @param projectId - Project ID
   * @param userEmail - Current user email
   * @returns Observable<Message[]>
   */
  getUnread(projectId: string, userEmail: string): Observable<Message[]> {
    return this.filter({
      project_id: projectId,
      is_read: false
      // Note: You might need to add logic to exclude messages sent by current user
    });
  }

  /**
   * Mark message as read
   * @param id - Message ID
   * @returns Observable<Message>
   */
  markAsRead(id: string | number): Observable<Message> {
    return this.update(id, { is_read: true });
  }

  /**
   * Send a new message
   * @param projectId - Project ID
   * @param senderEmail - Sender email
   * @param senderName - Sender name
   * @param content - Message content
   * @returns Observable<Message>
   */
  send(projectId: string, senderEmail: string, senderName: string, content: string): Observable<Message> {
    return this.create({
      project_id: projectId,
      sender_email: senderEmail,
      sender_name: senderName,
      content: content,
      is_read: false
    });
  }
}
