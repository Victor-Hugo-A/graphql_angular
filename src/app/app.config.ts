import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../assets/environments/environment';

function apolloOptionsFactory(httpLink: HttpLink): ApolloClientOptions<unknown> {
  const http = httpLink.create({ uri: environment.apiUrl /* .../graphql */ });

  const authLink = setContext(() => {
    const token = localStorage.getItem('access_token');
    return { headers: token ? { Authorization: `Bearer ${token}` } : {} };
  });

  return {
    link: ApolloLink.from([authLink, http]),
    cache: new InMemoryCache(),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    Apollo,
    { provide: APOLLO_OPTIONS, useFactory: apolloOptionsFactory, deps: [HttpLink] },
  ],
};
