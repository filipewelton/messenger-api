import { CustomError } from './custom-error'

export class UserAlreadyRegisteredError extends CustomError {
  public status = 409
  public reason = null

  constructor() {
    super('A user has already been registered with the same email.')
  }
}
