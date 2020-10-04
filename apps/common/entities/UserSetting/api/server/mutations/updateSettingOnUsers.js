import { Meteor } from 'meteor/meteor';
import checkOptions from '../../../../../helpers/checkOptions';
import parseHost from '../../../../../helpers/parseHost';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';
import entityUpdate from '../../../../../helpers/server/entityUpdate';

const getUpdatedUserSettings = (existingUserSettings, newSetting) => {
  try {
    const userSettings = [...existingUserSettings];
    const userSettingToUpdate = userSettings.find(
      (settingOnUser) => settingOnUser._id === newSetting._id,
    ); // eslint-disable-line

    if (userSettingToUpdate) {
      userSettingToUpdate.isGDPR = newSetting.isGDPR;
      userSettingToUpdate.type = newSetting.type;
      userSettingToUpdate.value = newSetting.value;
      userSettingToUpdate.key = newSetting.key;
      userSettingToUpdate.label = newSetting.label;
    }
    return userSettings;
  } catch (exception) {
    throw new Error(`[updateSettingOnUsers.getUpdatedUserSettings] ${exception.message}`);
  }
};

const updateUsersSettings = (users, setting, party, host, currentHostSettings) => {
  try {
    users.forEach((user) => {
      const doc = {};
      doc[currentHostSettings] = getUpdatedUserSettings(user.hosts[host].settings, setting);
      entityUpdate(Meteor.users, { _id: user._id }, doc, 'admin update user setting', party);
    });
  } catch (exception) {
    throw new Error(`[updateSettingOnUsers.updateUsersSettings] ${exception.message}`);
  }
};

const getUsers = (currentHostSettings) => {
  try {
    const selector = {};
    selector[currentHostSettings] = { $exists: true };

    const options = {
      fields: { _id: 1 },
    };
    options.fields[currentHostSettings] = 1;

    return Meteor.users.find(selector, options).fetch();
  } catch (exception) {
    throw new Error(`[updateSettingOnUsers.getUsers] ${exception.message}`);
  }
};

export default (options) => {
  try {
    checkOptions(options, (params) => {
      if (!params.setting) throw new Error('setting is required');
    });
    const { setting, context } = options;

    const host = setting.host || parseHost(context.headers.origin);
    const currentHostSettings = `hosts.${parseDotToUnderscore(host)}.settings`;

    const party = parseMemberFromContext(context);
    const users = getUsers(currentHostSettings);

    updateUsersSettings(users, setting, party, host, currentHostSettings);
  } catch (exception) {
    throw new Error(`[updateSettingOnUsers] ${exception.message}`);
  }
};
