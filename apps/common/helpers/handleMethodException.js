import parseExceptionMessage from './parseExceptionMessage';

export default (exception) => {
  const message = parseExceptionMessage(exception);
  console.error(message);
  throw new Error(message);
};
