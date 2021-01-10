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
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue', 'Processing'] } },
      queryOr: queryOr(props),
    },
    listNotificationCurrent: {
      auth: ['user', 'member', 'spv'],
      query: { status: { $in: ['Active'] } },
      queryOr: queryOr(props),
    },
    listNotificationHistory: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Closed', 'Void', 'Refund'] } },
      queryOr: queryOr(props),
    },
    addNotification: {
      auth: ['user', 'member', 'spv'],
    },
    updateNotification: {
      auth: ['user', 'member', 'spv'],
    },
    removeNotification: {
      auth: ['spv'],
    },
    setNotificationStatusToActive: {
      auth: ['member', 'spv'],
    },
    setNotificationStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getNotificationJSONdefs;
