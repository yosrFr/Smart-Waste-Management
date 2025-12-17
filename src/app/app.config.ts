/* eslint-disable @nx/enforce-module-boundaries */
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import {
  reducers,
  effects,
  AuthService,
} from '@smart-waste-management/shared/data-access';
import { authInterceptor } from '@smart-waste-management/shared/data-access';

export function initAuth(authService: AuthService) {
  return () => authService.restoreSession();
}

/**
 * Configuration globale de l'application
 * Configure tous les providers nécessaires:
 * - Router
 * - Animations Angular Material
 * - HttpClient
 * - NgRx Store & Effects
 * - DevTools (en mode dev uniquement)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(reducers),
    provideEffects(effects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: false,
      traceLimit: 75,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
