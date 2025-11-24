import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { switchMap, tap, shareReplay } from 'rxjs/operators';
import { Base44Service } from './base44.service';
import { Notification } from '../models/notification.model';

/**
 * Notification Service
 * Handles all notification-related API operations
 * Includes real-time polling for new notifications
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly entityName = 'Notification';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private base44Service: Base44Service) {
    this.startPolling();
  }

  list(sortField: string = '-created_date'): Observable<Notification[]> {
    return this.base44Service.list<Notification>(this.entityName, sortField);
  }

  filter(filters: Record<string, any>): Observable<Notification[]> {
    return this.base44Service.filter<Notification>(this.entityName, filters);
  }

  get(id: string | number): Observable<Notification> {
    return this.base44Service.get<Notification>(this.entityName, id);
  }

  create(notification: Partial<Notification>): Observable<Notification> {
    return this.base44Service.create<Notification>(this.entityName, notification);
  }

  update(id: string | number, notification: Partial<Notification>): Observable<Notification> {
    return this.base44Service.update<Notification>(this.entityName, id, notification);
  }

  delete(id: string | number): Observable<void> {
    return this.base44Service.delete(this.entityName, id);
  }

  /**
   * Get unread notifications for a user
   * @param userEmail - User email
   * @returns Observable<Notification[]>
   */
  getUnread(userEmail: string): Observable<Notification[]> {
    return this.filter({
      user_email: userEmail,
      is_read: false
    }).pipe(
      tap(notifications => {
        this.unreadCountSubject.next(notifications.length);
      })
    );
  }

  /**
   * Mark notification as read
   * @param id - Notification ID
   * @returns Observable<Notification>
   */
  markAsRead(id: string | number): Observable<Notification> {
    return this.update(id, { is_read: true }).pipe(
      tap(() => {
        // Decrease unread count
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, currentCount - 1));
      })
    );
  }

  /**
   * Mark all notifications as read for a user
   * @param userEmail - User email
   * @returns Observable<Notification[]>
   */
  markAllAsRead(userEmail: string): Observable<Notification[]> {
    // Note: This would need a custom endpoint in Base44 API
    // For now, we'll fetch and update individually
    return this.getUnread(userEmail).pipe(
      switchMap(notifications => {
        // Update each notification
        const updates = notifications.map(n => this.markAsRead(n.id!));
        // Return empty array after all updates
        return new Observable<Notification[]>(observer => {
          Promise.all(updates.map(obs => obs.toPromise())).then(() => {
            observer.next([]);
            observer.complete();
          });
        });
      })
    );
  }

  /**
   * Poll for new notifications every 30 seconds
   */
  private startPolling(): void {
    this.base44Service.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return [];
        }
        // Poll every 30 seconds
        return timer(0, 30000).pipe(
          switchMap(() => this.getUnread(user.email)),
          shareReplay(1)
        );
      })
    ).subscribe();
  }
}
