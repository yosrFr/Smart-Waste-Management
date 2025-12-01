/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { CreateNotificationDto, Notification } from '../../models';

/**
 * Actions pour les notifications
 */
export const loadNotifications = createAction(
  '[Notifications] Load Notifications'
);

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>()
);

// Pour la simulation de reception des notification
export const addNotification = createAction(
  '[Notifications] Add Notification',
  props<{ notification: Notification }>()
);

export const createNotification = createAction(
  '[Notifications] Create Notification',
  props<{ dto: CreateNotificationDto }>()
);

export const createNotificationSuccess = createAction(
  '[Notifications] Create Notification Success',
  props<{ notification: Notification }>()
);

export const setPageIndex = createAction(
  '[Notifications] Set Page Index',
  props<{ pageIndex: number }>()
);

export const setPageSize = createAction(
  '[Notifications] Set Page Size',
  props<{ pageSize: number }>()
);
