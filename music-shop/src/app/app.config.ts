// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from './auth.interceptor'; // Убедитесь, что путь верный

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // Вызов provideHttpClient
      withInterceptors([authInterceptorFn]) // Передаем интерсептор
    ), // <-- Вот недостающая закрывающая скобка
  ], // Закрываем массив providers
};
