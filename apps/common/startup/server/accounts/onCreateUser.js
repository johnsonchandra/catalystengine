import { Accounts } from 'meteor/accounts-base';

import UserSetting from '../../../entities/UserSetting/api';

import parseDotToUnderscore from '../../../helpers/parseDotToUnderscore';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;

  const settings = UserSetting.find({ host: options.host }).fetch();
  userToCreate.hosts = {};
  userToCreate.hosts[parseDotToUnderscore(options.host)] = {
    settings,
    visit: {
      first: {
        clientAddress: (options.connection && options.connection.clientAddress) || '',
        httpHeaders: (options.connection && options.connection.httpHeaders) || {},
        timestamp: new Date(),
      },
    },
  };

  return userToCreate;
});
