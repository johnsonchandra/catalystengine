export default (options) => {
  const projection = {};
  ['limit', 'skip', 'sort', 'fields'].forEach((key) => {
    if (options[key]) projection[key] = options[key];
  });
  return projection;
};
