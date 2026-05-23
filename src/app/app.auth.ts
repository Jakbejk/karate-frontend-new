import {environment} from '../environments/environment';
import {
  AutoRefreshTokenService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, ProvideKeycloakOptions,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';

export const keycloak: ProvideKeycloakOptions = {
  config: {
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  },
  initOptions: {
    onLoad: 'login-required',
  },
  features: [
    withAutoRefreshToken({
      onInactivityTimeout: 'logout',
      sessionTimeout: 60000,
    }),
  ],
  providers: [AutoRefreshTokenService, UserActivityService],
}

export const bearerTokenInterceptorConfig = {
  provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  useValue: [
    {
      urlPattern: new RegExp(`^${new URL(environment.api.url).origin}`),
      httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  ],
}
