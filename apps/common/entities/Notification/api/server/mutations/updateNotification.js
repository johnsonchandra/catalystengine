import Notification from '../..';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../helpers/ownerQuery';
import authorizer from '../../../../../helpers/server/authorizer';

import getNotificationJSONdefs from '../../utils/getNotificationJSONdefs';

import editNotification from '../processors/editNotification';

const publishName = 'updateNotification';
const updateNotification = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(
      options,
      publishName,
      getNotificationJSONdefs,
      checkOptionsArgsId,
    );
    const { args } = options;

    const notification = Notification.findOne({
      _id: args._id,
      ...ownerQuery(tenant.owner),
    });
    if (!notification) throw new Error(`[${publishName}] Notification not found`);

    resolve(editNotification(args, notification, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateNotification(options, resolve, reject);
  });
