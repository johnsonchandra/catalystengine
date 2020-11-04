import detailFile from './detailFile';

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
};
