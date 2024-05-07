import { CustomError } from './custom-error'

export class UnauthorizedError extends CustomError {
  public status = 401

  constructor(public reason: unknown) {
    super('Unauthorized.')
  }
}
