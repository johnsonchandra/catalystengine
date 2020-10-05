import { Accounts } from 'meteor/accounts-base';

import UserLog from '../../../entities/UserLog/api';

import parseHost from '../../../helpers/parseHost';

// TODO see whether it works if login from mobile app
Accounts.onLogout((options) => {
  const host = parseHost(options.connection.httpHeaders.host);
  const timestamp = new Date();

  UserLog.insert({
    userId: options.user._id,
    host,
    timestamp,
    clientAddress: options.connection.clientAddress,
    httpHeaders: options.connection.httpHeaders,
    type: 'Logout',
  });
});
