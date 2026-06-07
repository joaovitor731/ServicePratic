export class AuthError extends Error {
  constructor(message = 'Credenciais inválidas') {
    super(message);
    this.name = 'AuthError';
  }
}
