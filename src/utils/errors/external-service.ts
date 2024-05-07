import { CustomError } from './custom-error'

export class ExternalServiceError extends CustomError {
  public status = 500

  constructor(public reason: unknown) {
    super('External service error.')
  }
}
