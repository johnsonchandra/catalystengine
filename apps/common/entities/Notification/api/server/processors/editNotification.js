import sanitizeHtml from 'sanitize-html';

import Notification from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';

const editNotification = (args, notification, party) => {
  if (notification.status === 'Processing')
    throw new Error('Notification is in other process. Please wait and repeat');

  if (!(notification.status === 'Draft' || notification.status === 'Queue'))
    throw new Error(`Notification status: ${notification.status} cannot be edited anymore`);

  const newDoc = cleanseDocDiff(args, notification);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(Notification, { _id: notification._id }, newDoc, 'Updating Notification', party);
  return Notification.findOne(args._id);
};

export default editNotification;
