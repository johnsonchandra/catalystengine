import getNotificationJSONdefs from '../../utils/getNotificationJSONdefs';

import authorizer from '../../../../../helpers/server/authorizer';
import createNotification from '../processors/createNotification';

const publishName = 'addNotification';
const addNotification = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getNotificationJSONdefs);
    const { args } = options;

    resolve(createNotification(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    addNotification(options, resolve, reject);
  });
