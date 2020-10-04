/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import checkOptions from '../../../../../helpers/checkOptions';
import parseHost from '../../../../../helpers/parseHost';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';
import entityAddToSet from '../../../../../helpers/server/entityAddToSet';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

const addSetting = (setting, party, host) => {
  const currentHost = `hosts.${parseDotToUnderscore(setting.host || host)}`;

  const selector = {};
  selector[currentHost] = { $exists: true };

  const userIds = Meteor.users
    .find(selector, { fields: { _id: 1 } })
    .fetch()
    .map(({ _id }) => _id);

  const docAddToSet = {};
  docAddToSet[`${currentHost}.settings`] = setting;

  return entityAddToSet(
    Meteor.users,
    { _id: { $in: userIds } },
    docAddToSet,
    'admin add new setting for user',
    party,
    new Date(),
    { multi: true },
  );
};

export default (options) => {
  try {
    checkOptions(options, (params) => {
      if (!params.setting) throw new Error('setting is required');
    });
    const { setting, context } = options;

    const host = parseHost(context.headers.origin);
    const party = parseMemberFromContext(context);

    return addSetting(setting, party, host);
  } catch (exception) {
    throw new Error(`[addSettingToUsers] ${exception.message}`);
  }
};
