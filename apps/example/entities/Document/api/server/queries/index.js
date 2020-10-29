import detailDocument from './detailDocument';

export default {
  detailDocument: (parent, args, context) =>
    detailDocument({
      context,
      _id: (parent && parent.DocumentId) || args._id,
      publishName: 'detailDocument',
    }),
  getDocument: (parent, args, context) =>
    detailDocument({
      context,
      _id: (parent && parent.DocumentId) || args._id,
      publishName: 'getDocument',
    }),
};
