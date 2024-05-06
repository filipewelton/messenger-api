export class ExternalServiceError extends Error {
  public status = 500

  constructor(public reason: unknown) {
    super('External service error.')
  }
}
