const getCounterJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { counter: options && options.search },
    { type: options && options.search },
  ];

  const defs = {
    detailCounter: {
      auth: ['member', 'spv'],
      query: { _id: props && props._id },
    },
    getCounter: {
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
    listCounterDraft: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listCounterCurrent: {
      auth: ['member', 'spv'],
      query: { status: 'Active' },
      queryOr: queryOr(props),
    },
    listCounterHistory: {
      auth: ['spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    listCounterProcessing: {
      auth: ['spv'],
      query: { status: 'Processing' },
      queryOr: queryOr(props),
    },
    addCounter: {
      auth: ['member'],
    },
    updateCounter: {
      auth: ['member'],
    },
    removeCounter: {
      auth: ['spv'],
    },
    setCounterStatusToActive: {
      auth: ['spv'],
    },
    setCounterStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getCounterJSONdefs;
