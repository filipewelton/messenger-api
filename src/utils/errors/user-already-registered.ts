export class UserAlreadyRegisteredError extends Error {
  public status = 409

  constructor() {
    super('A user has already been registered with the same email.')
  }
}
