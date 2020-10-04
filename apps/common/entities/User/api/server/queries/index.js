import detailUser from './detailUser';
import exportUserData from './exportUserData';

import listUserByOrg from './listUserByOrg';
import listUserSettingsByHost from './listUserSettingsByHost';

export default {
  detailUser: (parent, args, context) => {
    const userIdFromParentQuery = parent && parent.userId;
    const userIdToQuery = userIdFromParentQuery || args._id || context.user._id;

    return detailUser({
      args,
      context,
      userIdToQuery,
    });
  },

  listUserByOrg: (parent, args, context) =>
    listUserByOrg({
      context,
      _id: (parent && parent._id) || (parent && parent.OrgId),
    }),

  listUserSettingsByHost: (parent, args, context) =>
    listUserSettingsByHost({
      context,
      _id: (parent && parent.UserId) || context.user._id,
    }),

  exportUserData: (parent, args, { user }) =>
    exportUserData({
      user,
    }),
};
