const getCounterJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { counter: options && options.search },
    { type: options && options.search },
  ];

  const defs = {
    listCounterDraft: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listCounterCurrent: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listCounterHistory: {
      auth: ['spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    detailCounter: {
      auth: ['member'],
      query: { _id: props && props._id },
      // fields: {} add if needed
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
