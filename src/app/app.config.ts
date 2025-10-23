// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Se você usa animações, mantenha esta linha e garanta @angular/animations instalado
// Se NÃO usa, pode remover provideAnimations() e o import.
import { provideAnimations } from '@angular/platform-browser/animations';

import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { environment } from '../assets/environments/environment';

function apolloOptionsFactory(httpLink: HttpLink): ApolloClientOptions<unknown> {
  // Use a chave que você realmente tem no environment (ex.: apiUrl)
  const uri = environment.apiUrl ?? 'http://localhost:8180/graphql';
  const http = httpLink.create({ uri });

  return {
    link: ApolloLink.from([http]),
    cache: new InMemoryCache(),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),           // ✅ suas rotas continuam aqui
    provideHttpClient(withFetch()),  // ✅ HttpClient para o HttpLink
    provideAnimations(),             // ❗ remova se não tiver @angular/animations instalado

    Apollo,                          // ✅ garante o provider de Apollo (evita NG0201)
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloOptionsFactory,
      deps: [HttpLink],
    },
  ],
};
