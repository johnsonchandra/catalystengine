import detailFile from './detailFile';
import listFileByTypeId from './listFileByTypeId';
import listFileByRef from './listFileByRef';

export default {
  detailFile: (parent, args, context) =>
    detailFile({
      context,
      _id: (parent && parent.FileId) || args._id,
      publishName: 'detailFile',
    }),
  getFile: (parent, args, context) =>
    detailFile({
      context,
      _id: (parent && parent.FileId) || args._id,
      publishName: 'getFile',
    }),
  listFileByTypeId: (parent, args, context) =>
    listFileByTypeId({
      context,
      _id: parent && (parent._id || args._id),
      type: args && args.type,
    }),
  listFileByRef: (parent, args, context) =>
    listFileByRef({
      context,
      _id: parent && (parent._id || args._id),
      type: args && args.type,
    }),
};
