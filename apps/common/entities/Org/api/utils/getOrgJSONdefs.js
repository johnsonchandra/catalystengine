const getOrgJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { shortname: options && options.search },
    { nr: options && options.search },
    { phone: options && options.search },
  ];

  const defs = {
    listOrgDraftAll: {
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listOrgDraftHost: {
      auth: ['admin'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      fields: {
        nr: 1,
        name: 1,
        shortname: 1,
        phone: 1,
        featureNr: 1,
        sequenceNr: 1,
        type: 1,
        status: 1,
        description: 1,
        updatedAt: 1,
      },
      queryOr: queryOr(props),
    },
    listOrgCurrentAll: {
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listOrgCurrentHost: {
      auth: ['admin'],
      query: { status: { $in: ['Processing', 'Active'] } },
      fields: {
        nr: 1,
        name: 1,
        shortname: 1,
        phone: 1,
        featureNr: 1,
        sequenceNr: 1,
        type: 1,
        status: 1,
        description: 1,
        updatedAt: 1,
      },
      queryOr: queryOr(props),
    },
    listOrgCurrentFeatureAll: {
      query: { featureNr: { $gt: 0 }, status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listOrgCurrentFeatureHost: {
      auth: ['admin'],
      query: { featureNr: { $gt: 0 }, status: { $in: ['Processing', 'Active'] } },
      fields: {
        nr: 1,
        name: 1,
        shortname: 1,
        phone: 1,
        featureNr: 1,
        sequenceNr: 1,
        type: 1,
        status: 1,
        description: 1,
        updatedAt: 1,
      },
      queryOr: queryOr(props),
    },
    listOrgHistoryAll: {
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    listOrgHistoryHost: {
      auth: ['admin'],
      query: { status: 'Closed' },
      fields: {
        nr: 1,
        name: 1,
        shortname: 1,
        phone: 1,
        featureNr: 1,
        sequenceNr: 1,
        type: 1,
        status: 1,
        description: 1,
        updatedAt: 1,
      },
      queryOr: queryOr(props),
    },
    detailOrg: {
      auth: ['admin'],
      query: { _id: props && props._id },
      fields: {
        nr: 1,
        name: 1,
        shortname: 1,
        phone: 1,
        featureNr: 1,
        sequenceNr: 1,
        type: 1,
        status: 1,
        description: 1,
        updatedAt: 1,
      },
    },
    addOrg: {
      auth: ['admin'],
    },
    updateOrg: {
      auth: ['admin'],
    },
    removeOrg: {
      auth: ['admin'],
    },
    setOrgStatusToActive: {
      auth: ['admin'],
    },
    setOrgStatusToClosed: {
      auth: ['admin'], // Global Roles, implement in logic
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getOrgJSONdefs;
