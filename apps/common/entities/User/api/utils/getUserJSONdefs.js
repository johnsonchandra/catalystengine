const getUserJSONdefs = (publishName, props) => {
  const queryOr = (options) => [
    { _id: options && options.search },
    { 'profile.fullname': options && options.search },
    { 'profile.shortname': options && options.search },
    { 'profile.phone': options && options.search },
    { 'emails.address': options && options.search },
  ];

  const defs = {
    listUserCurrentAll: {
      // no auth here, special case for super admin
      query: { _id: { $ne: props && props._id } },
      fields: { profile: 1, emails: 1, status: 1, hosts: 1 },
      queryOr: queryOr(props),
    },
    listUserCurrentHost: {
      auth: ['admin'],
      query: { _id: { $ne: props && props._id } }, // in pubProcessorUser hosts will be added
      fields: { profile: 1, emails: 1, status: 1 },
      queryOr: queryOr(props),
    },
    listUserOnlineAll: {
      // no auth here, special case for super admin
      query: { _id: { $ne: props && props._id }, 'status.online': true },
      fields: { profile: 1, emails: 1, status: 1, hosts: 1 },
      queryOr: queryOr(props),
    },
    listUserOnlineHost: {
      auth: ['admin'],
      query: { _id: { $ne: props && props._id }, 'status.online': true }, // in pubProcessorUser hosts will be added
      fields: { profile: 1, emails: 1, status: 1 },
      queryOr: queryOr(props),
    },
  };
  if (defs[publishName]) return defs[publishName];

  throw new Error(`JSON defs for ${publishName} not found`);
};

export default getUserJSONdefs;
