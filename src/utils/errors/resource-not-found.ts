import { CustomError } from './custom-error'

export class ResourceNotFoundError extends CustomError {
  public status = 404

  constructor(public reason: unknown) {
    super('Resource not found.')
  }
}
