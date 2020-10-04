import detailFile from './detailFile';

export default {
  detailFile: (parent, args, context) =>
    detailFile({
      context,
      _id: (parent && parent.FileId) || args._id,
      // fields: {} add if needed, fields here has lower priority than fields in getJSONDefs
    }),
};
