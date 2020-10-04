import { Meteor } from 'meteor/meteor';

import _ from 'lodash';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import parseHost from '../../../../../helpers/parseHost';
import checkOptions from '../../../../../helpers/checkOptions';
import parseUserRoles from '../../../../../helpers/parseUserRoles';
import getTenant from '../../../../../helpers/getTenant';

import Org from '../../../../Org/api';
import isAdmin from '../../../../../helpers/isAdmin';

const publishName = 'listUserByOrg';
const action = (options, tenant, host) => {
  const { _id, context } = options;

  if (!isAdmin(context.user._id, host)) return [];

  const org = Org.findOne(_id);
  if (!org) throw new Error('Org not found');

  // get User in Org in Host
  const scope = isAdmin(context.user._id) ? new RegExp(`${org._id}.org`) : `${org._id}.org.${host}`;
  const orgMembers = Meteor.roleAssignment.find({ scope }).fetch();
  const orgMembersUniqId = _.uniq(orgMembers.map((orgMember) => orgMember.user._id));

  const users = [];
  orgMembersUniqId.forEach((userId) => {
    const user = Meteor.users.findOne(userId);
    users.push({
      _id: user._id,
      fullname: user.profile.fullname,
      roles: parseUserRoles(
        user._id,
        tenant.rolesUserInOrg,
        `${org._id}.org.${host}`,
        `${org.name} at ${host}`,
      ),
    });
  });

  return users;
};

const listUserByOrg = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);
    const { context } = options;
    const host = parseHost(context.headers.origin);
    const tenant = getTenant(host);
    resolve(action(options, tenant, host));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    listUserByOrg(options, resolve, reject);
  });
