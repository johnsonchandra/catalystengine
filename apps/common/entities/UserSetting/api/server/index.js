import UserSetting from '../index';

import createIndex from '../../../../helpers/server/createIndex';

createIndex(UserSetting, { host: 1 });
