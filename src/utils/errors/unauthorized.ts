import { CustomError } from './custom-error'

export class Unauthorized extends CustomError {
  public status = 401

  constructor(public reason: unknown) {
    super('Unauthorized.')
  }
}
