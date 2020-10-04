const getFileJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { nr: options && options.search },
    { 'refs._id': options && options.search },
    { 'refs.name': options && options.search },
    { type: options && options.search },
    { tags: options && options.search },
  ];

  const defs = {
    listFileDraft: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listFileCurrent: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listFileHistory: {
      auth: ['spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    // FIXME belum ada pub maupun gql query, just preparing
    listFileByRef: {
      query: {
        status: 'Active',
        'refs._id': props && props.refs && props.refs._id,
        'refs.type': props && props.refs && props.refs.type,
      },
    },
    detailFile: {
      auth: ['member'],
      query: { _id: props && props._id },
      // fields: {} add if needed
    },
    addFile: {
      auth: ['member'],
    },
    updateFile: {
      auth: ['member'],
    },
    removeFile: {
      auth: ['spv'],
    },
    setFileStatusToActive: {
      auth: ['spv'],
    },
    setFileStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getFileJSONdefs;
