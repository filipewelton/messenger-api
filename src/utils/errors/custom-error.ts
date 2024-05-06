export abstract class CustomError extends Error {
  public abstract status: number
  public abstract reason: unknown
}
