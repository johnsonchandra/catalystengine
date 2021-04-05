export default (exception) =>
  exception.sanitizedError && exception.sanitizedError.message
    ? exception.sanitizedError.message
    : exception.message || exception.reason || exception;
