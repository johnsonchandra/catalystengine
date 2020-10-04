import detailCounter from './detailCounter';

export default {
  detailCounter: (parent, args, context) =>
    detailCounter({
      context,
      _id: (parent && parent.CounterId) || args._id,
      // fields: {} add if needed, fields here has lower priority than fields in getJSONDefs
    }),
};
