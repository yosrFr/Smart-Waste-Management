/* eslint-disable @nx/enforce-module-boundaries */
import { createAction, props } from '@ngrx/store';
import { CreateNotificationDto, Notification } from '../../models';

/**
 * Actions pour les notifications
 */
export const setNotifications = createAction(
  '[Notifications] Set Notifications',
  props<{ notifications: Notification[] }>()
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
