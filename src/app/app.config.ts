/* eslint-disable @nx/enforce-module-boundaries */
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import {
  authReducer,
  AuthEffects,
  reducers,
  effects,
} from '@smart-waste-management/shared/data-access';
import { authInterceptor } from '@smart-waste-management/shared/data-access';

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
  ],
};
