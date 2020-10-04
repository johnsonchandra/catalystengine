import detailOrg from './detailOrg';

export default {
  detailOrg: (parent, args, context) =>
    detailOrg({
      context,
      _id: (parent && parent.OrgId) || args._id,
    }),
};
