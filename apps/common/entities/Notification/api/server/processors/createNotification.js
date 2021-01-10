import Notification from '../..';

import entityInsert from '../../../../../helpers/server/entityInsert';

const createNotification = (args, party, tenant) => {
  const now = new Date();

  const newDoc = {
    ...args,
    type: 'Info',
    status: 'Draft',
  };

  const _id = entityInsert(
    Notification,
    newDoc,
    'Create new Notification',
    party,
    tenant.owner,
    now,
  );

  return Notification.findOne(_id);
};

export default createNotification;
