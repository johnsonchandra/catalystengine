import Notification from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processNotificationToClosed = (notification, party) => {
  if (notification.status === 'Processing')
    throw new Error('Notification is in other process. Please wait and repeat');

  // if (!(notification.status === 'Active' || notification.status === 'Delivering'))
  if (notification.status !== 'Active')
    throw new Error(`Notification status: ${notification.status} may not be set to Closed`);

  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Notification,
    { _id: notification._id },
    {
      status: 'Processing',
    },
    'Processing processNotificationToClosed',
    party,
    timestamp,
  );

  timestamp = new Date();

  // add additional steps here if necessary

  entityUpdate(
    Notification,
    { _id: notification._id },
    {
      status: 'Closed',
    },
    'Set Notification to Closed',
    party,
    timestamp,
  );

  return Notification.findOne(notification._id);
};

export default processNotificationToClosed;
