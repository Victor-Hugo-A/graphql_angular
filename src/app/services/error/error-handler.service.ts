// src/app/services/error/error-handler.service.ts
import { Injectable } from '@angular/core';
import { GraphQLError } from '../../types/graphql.types';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleGraphQLErrors(errors: GraphQLError[]): string {
    if (!errors || errors.length === 0) {
      return 'Erro desconhecido';
    }

    const error = errors[0];
    return this.extractErrorMessage(error);
  }

  extractErrorMessage(error: GraphQLError): string {
    const message = error.message;

    if (message.includes('EMAIL_JA_CADASTRADO:')) {
      return message.split(':')[1];
    }
    if (message.includes('USUARIO_NAO_ENCONTRADO:')) {
      return message.split(':')[1];
    }
    if (message.includes('ERRO_INTEGRIDADE:')) {
      return message.split(':')[1];
    }
    if (message.includes('ERRO_INTERNO:')) {
      return 'Erro interno: ' + message.split(':')[1];
    }

    return message || 'Erro desconhecido';
  }

  // ✅ ADICIONE ESTE MÉTODO QUE ESTAVA FALTANDO
  logError(error: any, context: string = ''): void {
    console.error(`[${context}] Erro:`, error);
  }
}
