const getTenantJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { name: options && options.search },
    { nr: options && options.search },
  ];

  const defs = {
    listTenantDraft: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Draft', 'Queue'] } },
      queryOr: queryOr(props),
    },
    listTenantCurrent: {
      auth: ['member', 'spv'],
      query: { status: { $in: ['Processing', 'Active'] } },
      queryOr: queryOr(props),
    },
    listTenantHistory: {
      auth: ['spv'],
      query: { status: 'Closed' },
      queryOr: queryOr(props),
    },
    detailTenant: {
      auth: ['member'],
      query: { _id: props && props._id },
      // fields: {} add if needed
    },
    addTenant: {
      auth: ['member'],
    },
    updateTenant: {
      auth: ['member'],
    },
    removeTenant: {
      auth: ['spv'],
    },
    setTenantStatusToActive: {
      auth: ['spv'],
    },
    setTenantStatusToClosed: {
      auth: ['spv'],
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getTenantJSONdefs;
