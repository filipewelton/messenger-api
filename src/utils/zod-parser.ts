import { ZodError } from 'zod'

export function parseZodError(zodError: ZodError) {
  const { errors } = zodError

  const parsedError = errors.reduce((parsed, { path, message }) => {
    return {
      ...parsed,
      [path[0]]: message,
    }
  }, {})

  return {
    message: 'Invalid request body.',
    errors: parsedError,
  }
}
