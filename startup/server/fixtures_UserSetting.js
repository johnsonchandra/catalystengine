import { Meteor } from 'meteor/meteor';

import UserSetting from '../../apps/common/entities/UserSetting/api';
import Tenant from '../../apps/common/entities/Tenant/api';

const userSettingExist = UserSetting.findOne();

if (Meteor.isDevelopment && !userSettingExist) {
  console.info('[ FIXTURE START ] UserSetting', new Date());

  const defaultUserSettings = [
    {
      isGDPR: true,
      key: 'canSendMarketingEmails',
      label: 'Can we send you marketing emails?',
      type: 'boolean',
      value: 'false', // Pass a string and allow schema to convert to a Boolean for us.
    },
    {
      isGDPR: false,
      key: 'canSendNotification',
      label: 'Can we send you Notification?',
      type: 'boolean',
      value: 'true', // Pass a string and allow schema to convert to a Boolean for us.
    },
  ];

  defaultUserSettings.forEach((setting) => {
    const tenants = Tenant.find({}).fetch();

    tenants.forEach((tenant) => {
      if (!UserSetting.findOne({ host: tenant.host, key: setting.key })) {
        UserSetting.insert({ host: tenant.host, ...setting, setByUser: false });
      }
    });
  });

  console.info('[ FIXTURE END ] UserSetting', new Date());
}
