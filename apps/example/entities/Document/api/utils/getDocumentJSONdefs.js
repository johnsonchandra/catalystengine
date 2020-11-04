const getDocumentJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { nr: options && options.search },
  ];

  const defs = {
    detailDocument: {
      auth: ['member', 'spv'],
      query: { _id: props && props._id },
    },
    getDocument: {
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
    listDocumentDraft: {
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listDocumentCurrent: {
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listDocumentHistory: {
      auth: ['member', 'spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    addDocument: {
      auth: ['user', 'member', 'spv'],
    },
    updateDocument: {
      auth: ['user', 'member', 'spv'],
    },
    removeDocument: {
      auth: ['spv'],
    },
    setDocumentStatusToActive: {
      auth: ['spv'],
    },
    setDocumentStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getDocumentJSONdefs;
