import { CustomError } from './custom-error'

export class ConflictError extends CustomError {
  public status = 409

  constructor(public reason: unknown) {
    super('Conflict error.')
  }
}
