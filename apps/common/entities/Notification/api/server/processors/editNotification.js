import sanitizeHtml from 'sanitize-html';

import Notification from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';

const editNotification = (args, notification, party) => {
  if (notification.status === 'Processing')
    throw new Error('Notification is in other process. Please wait and repeat');

  if (!(notification.status === 'Draft' || notification.status === 'Queue'))
    throw new Error(`Notification status: ${notification.status} cannot be edited anymore`);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Notification,
    { _id: notification._id },
    {
      status: 'Processing',
    },
    'Processing editNotification',
    party,
  );

  const newDoc = cleanseDocDiff(args, notification);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;
  newDoc.status = notification.status;

  entityUpdate(
    Notification,
    { _id: notification._id },
    newDoc,
    `Notification updated, status back to ${notification.status}`,
    party,
  );
  return Notification.findOne(args._id);
};

export default editNotification;
