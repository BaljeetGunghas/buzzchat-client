export const resFormat = (
  status: number,
  message: string,
  jsonResponse: unknown = null,
  output: number = 1,
  token?: string
) => ({
  status,
  message,
  jsonResponse,
  output,
  ...(token && { token }),
});


export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Set the prototype explicitly to avoid issues with TypeScript and inheritance
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
