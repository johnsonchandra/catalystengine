import createIndex from '../../../../helpers/server/createIndex';
import Notification from '..';

createIndex(Notification, { nr: 1, name: 1, owner: 1 });
