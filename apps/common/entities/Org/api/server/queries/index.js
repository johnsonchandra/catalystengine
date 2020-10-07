import Org from '../..';

import detailOrg from './detailOrg';

export default {
  detailOrg: (parent, args, context) =>
    detailOrg({
      context,
      _id: (parent && parent.OrgId) || args._id,
    }),

  getOrg: (parent) => {
    const orgIdToQuery = parent && (parent.PartyId || parent.SellerId);
    if (!orgIdToQuery) return undefined;

    const org = Org.findOne(orgIdToQuery);
    if (!org) return undefined;

    return {
      _id: org._id,
      name: org.name,
      shortname: org.shortname,
      logoUrl: org.logoUrl,
      type: 'Org',
    };
  },
};
