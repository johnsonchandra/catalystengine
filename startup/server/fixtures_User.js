import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import faker from 'faker';

const userExist = Meteor.users.findOne();

if (Meteor.isDevelopment && !userExist) {
  console.info('[ FIXTURE START ] Roles - creating Global Roles', new Date());

  Meteor.settings.private.rolesGlobal.forEach((role) => {
    Roles.createRole(role, { unlessExists: true });
  });

  console.info('[ FIXTURE END ] Roles - creating Global Roles', new Date());

  console.info('[ FIXTURE START ] User - creating Global Admin', new Date());
  const adminId = Accounts.createUser({
    username: 'admin',
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      fullname: 'Green Arrow',
      shortname: 'ijo',
      phone: '+628174567890',
    },
  });

  Roles.addUsersToRoles(adminId, Meteor.settings.private.rolesGlobal);
  console.info('[ FIXTURE END ] User - creating global Admin', new Date());

  console.info('[ FIXTURE START ] User - creating global Member', new Date());
  const memberCount = 1;
  let memberIndex = 0;
  while (memberIndex < memberCount) {
    const firstName = faker.name.firstName();
    const memberId = Accounts.createUser({
      username: `member${memberIndex + 1}`,
      email: `member${memberIndex + 1}@member.com`,
      password: 'password',
      profile: {
        fullname: `${firstName} ${faker.name.lastName()}`,
        shortname: firstName,
        phone: faker.phone.phoneNumber(),
      },
    });

    Roles.addUsersToRoles(memberId, ['user', 'member']);

    memberIndex += 1;
  }

  console.info('[ FIXTURE END ] User - creating global Member', new Date());
}
