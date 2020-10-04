import { Meteor } from 'meteor/meteor';

import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import checkOptions from '../../../../../helpers/checkOptions';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

const publishName = 'setUserSettingsByUserToTrue';
const action = (party, host) => {
  const user = Meteor.users.findOne({
    _id: party._id,
  });

  const hostDotToUnderscore = parseDotToUnderscore(host);
  const settings =
    user &&
    user.hosts &&
    user.hosts[hostDotToUnderscore] &&
    user.hosts[hostDotToUnderscore].settings;
  if (!settings) throw new Error(`[${publishName}] User Settings not found`);

  let index = 0;
  while (index < settings.length) {
    settings[index].setByUser = true;
    index += 1;
  }

  const doc = {};
  doc[`hosts.${hostDotToUnderscore}.settings`] = settings;

  entityUpdate(
    Meteor.users,
    { _id: user._id },
    doc,
    `set user settings for host ${host} setByUser to true`,
    party,
  );

  return { _id: party._id };
};

const setUserSettingsByHostToTrue = (options, resolve, reject) => {
  try {
    checkOptions(options);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const party = parseMemberFromContext(context);

    resolve(action(party, host));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setUserSettingsByHostToTrue(options, resolve, reject);
  });
