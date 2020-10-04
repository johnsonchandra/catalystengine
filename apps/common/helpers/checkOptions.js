const checkOptions = (options, additionalCheckFunction) => {
  if (!options) throw new Error('options object is required.');

  const { context } = options;
  if (!context) throw new Error('context is required.');

  if (!context.headers) throw new Error('context.headers is required.');
  if (!context.headers.origin) throw new Error('context.headers.origin is required.');

  if (additionalCheckFunction) additionalCheckFunction(options);
};

export default checkOptions;
