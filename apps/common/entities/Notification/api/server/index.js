import createIndex from '../../../../helpers/server/createIndex';
import Notification from '..';

createIndex(Notification, { host: 1, from: 1, to: 1, owner: 1 });
