export class RouteNotFoundError extends Error {
  public status = 404

  constructor() {
    super('Route not found.')
  }
}
