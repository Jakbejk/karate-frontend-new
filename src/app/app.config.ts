import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
} from 'keycloak-angular';
import {routes} from './app.routes';
import {langs} from './app.lang';
import {bearerTokenInterceptorConfig, keycloak} from './app.auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(langs),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideKeycloak(keycloak),
    bearerTokenInterceptorConfig,
  ],
};
