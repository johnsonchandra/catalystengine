import createIndex from '../../../../helpers/server/createIndex';
import UserLog from '..';

createIndex(UserLog, { userId: 1, type: 1 });
