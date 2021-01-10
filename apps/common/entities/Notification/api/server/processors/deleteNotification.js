import Notification from '../..';

import ownerQuery from '../../../../../helpers/ownerQuery';
import entityRemove from '../../../../../helpers/server/entityRemove';

const deleteNotification = (args, party, tenant) => {
  const query = {
    _id: args._id,
    status: 'Draft',
    ...ownerQuery(tenant.owner),
  };

  entityRemove(Notification, query, 'Delete Notification permanently', party);
  return args;
};

export default deleteNotification;
