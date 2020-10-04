const checkOptionsArgsId = (options) => {
  const _id = options._id || (options.args && options.args._id);
  if (!_id) throw new Error('_id is required.');
};

export default checkOptionsArgsId;
