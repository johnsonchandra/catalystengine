const getNotificationJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { 'from.name': options && options.search },
    { 'to.name': options && options.search },
  ];

  const defs = {
    detailNotification: {
      auth: ['member', 'spv'],
      query: { _id: props && props._id },
    },
    getNotification: {
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
    listNotificationDraft: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listNotificationCurrent: {
      auth: ['member', 'spv'],
      query: { status: 'Active' },
      queryOr: queryOr(props),
    },
    listNotificationHistory: {
      auth: ['spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    listNotificationProcessing: {
      auth: ['spv'],
      query: { status: 'Processing' },
      queryOr: queryOr(props),
    },
    addNotification: {
      auth: ['member', 'spv'],
    },
    updateNotification: {
      auth: ['member', 'spv'],
    },
    removeNotification: {
      auth: ['spv'],
    },
    setNotificationStatusToActive: {
      auth: ['member', 'spv'],
    },
    setNotificationStatusToClosed: {
      auth: ['member', 'spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getNotificationJSONdefs;
