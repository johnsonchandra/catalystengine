import detailCounter from './detailCounter';

export default {
  detailCounter: (parent, args, context) =>
    detailCounter({
      context,
      _id: (parent && parent.CounterId) || args._id,
      publishName: 'detailCounter',
    }),
  getCounter: (parent, args, context) =>
    detailCounter({
      context,
      _id: (parent && parent.CounterId) || args._id,
      publishName: 'detailCounter',
    }),
};
