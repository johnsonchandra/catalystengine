import { Meteor } from 'meteor/meteor';

import _ from 'lodash';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import parseHost from '../../../../../helpers/parseHost';
import checkOptions from '../../../../../helpers/checkOptions';

const publishName = 'listUserSettingsByHost';
const action = (args, host) => {
  const user = Meteor.users.findOne(args._id);
  if (!user) throw new Error('User not found');
  if (!user.settings) throw new Error('User Settings not found');

  return _.filter(user.settings, { host });
};

const listUserSettingsByHost = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);
    const { context } = options;
    const host = parseHost(context.headers.origin);
    resolve(action(options, host));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    listUserSettingsByHost(options, resolve, reject);
  });
