import { CustomError } from './custom-error'

export class RouteNotFoundError extends CustomError {
  public status = 404
  public reason = null

  constructor() {
    super('Route not found.')
  }
}
