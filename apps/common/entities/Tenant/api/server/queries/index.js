import detailTenant from './detailTenant';

export default {
  detailTenant: (parent, args, context) =>
    detailTenant({
      context,
      _id: (parent && parent.TenantId) || args._id,
      // fields: {} add if needed, fields here has lower priority than fields in getJSONDefs
    }),
};
