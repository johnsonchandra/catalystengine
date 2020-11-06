const getFileJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { 'refs._id': options && options.search },
    { 'refs.name': options && options.search },
    { type: options && options.search },
    { typeId: options && options.search },
    { tags: options && options.search },
  ];

  const defs = {
    detailFile: {
      auth: ['user', 'member', 'spv'],
      query: { _id: props && props._id },
    },
    getFile: {
      query: { _id: props && props._id },
      fields: {
        owner: 0,
        createdBy: 0,
        createdAt: 0,
        updatedBy: 0,
        updatedAt: 0,
        histories: 0,
      },
    },
    listFileDraft: {
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listFileCurrent: {
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listFileHistory: {
      auth: ['member', 'spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    listFileByTypeId: {
      query: {
        typeId: props && props._id,
        type: props && props.type,
      },
    },
    listFileByRef: {
      query: {
        'refs._id': props && props._id,
        'refs.type': props && props.type,
      },
    },
    addFile: {
      auth: ['user', 'member', 'spv'],
    },
    saveFileToFS: {
      auth: ['user', 'member', 'spv'],
    },
    saveFileToS3: {
      auth: ['member', 'spv'],
    },
    updateFile: {
      auth: ['user', 'member', 'spv'],
    },
    removeFile: {
      auth: ['spv'],
    },
    setFileStatusToActive: {
      auth: ['member', 'spv'],
    },
    setFileStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getFileJSONdefs;
