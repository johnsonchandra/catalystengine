import Notification from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processNotificationToActive = (notification, party) => {
  if (notification.status === 'Processing')
    throw new Error('Notification is in other process. Please wait and repeat');

  if (!(notification.status === 'Draft' || notification.status === 'Queue'))
    throw new Error(`Notification status: ${notification.status} may not be set to Active`);

  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Notification,
    { _id: notification._id },
    {
      status: 'Processing',
    },
    'Processing processNotificationToActive',
    party,
    timestamp,
  );

  // add additional steps here if necessary

  timestamp = new Date();

  entityUpdate(
    Notification,
    { _id: notification._id },
    {
      status: 'Active',
    },
    'Set Notification to Active',
    party,
    timestamp,
  );

  return Notification.findOne(notification._id);
};

export default processNotificationToActive;
