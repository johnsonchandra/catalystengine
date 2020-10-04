import detailDocument from './detailDocument';

export default {
  detailDocument: (parent, args, context) =>
    detailDocument({
      context,
      _id: (parent && parent.DocumentId) || args._id,
      // fields: {} add if needed, fields here has lower priority than fields in getJSONDefs
    }),
};
