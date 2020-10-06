import { Meteor } from 'meteor/meteor';

import _ from 'lodash';

import parseHost from '../../../../../helpers/parseHost';
import checkOptions from '../../../../../helpers/checkOptions';
import parseUserRoles from '../../../../../helpers/parseUserRoles';
import isAdmin from '../../../../../helpers/isAdmin';
import getTenant from '../../../../../helpers/getTenant';
import getQueryHostExist from '../../../../../helpers/getQueryHostExist';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

import Org from '../../../../Org/api';
import Tenant from '../../../../Tenant/api';

const processOrgRoles = (_id, host, roles, rolesUser) => {
  let results = roles;
  const orgs = Org.find(getQueryHostExist(host)).fetch();
  orgs.forEach((org) => {
    results = results.concat(
      parseUserRoles(_id, rolesUser, `${org._id}.org.${host}`, `${org.name} at ${host}`),
    );
  });
  return results;
};

const action = (userToShow, context, tenant, host) => {
  const currentUserId = context && context.user && context.user._id;
  const isHostAdmin = isAdmin(currentUserId, host);
  const self = userToShow._id === currentUserId;
  const selfOrHostAdmin = self || isHostAdmin;

  // host roles
  let roles = selfOrHostAdmin ? parseUserRoles(userToShow._id, tenant.roles, host) : [];

  const hostDotToUnderscore = parseDotToUnderscore(host);

  if (self && !isHostAdmin) {
    // show only host n org that the user currently in, otherwise too much
    const userRoles = Meteor.roleAssignment.find({ 'user._id': userToShow._id }).fetch();
    const userScopes = _.uniq(userRoles.map((userRole) => userRole.scope)); // userScope here can be null if root

    userScopes.forEach((userScope) => {
      if (userScope && userScope.includes(`.org.${host}`)) {
        const org = Org.findOne({
          _id: userScope.substring(0, userScope.indexOf('.org.')),
        });

        roles = roles.concat(
          parseUserRoles(
            userToShow._id,
            tenant.rolesUserInOrg,
            `${org._id}.org.${host}`,
            `${org.name} at ${host}`,
          ),
        );
      }
    });
  }

  if (isHostAdmin) {
    // get all org related to this host
    roles = processOrgRoles(userToShow._id, host, roles, tenant.rolesUserInOrg);
  }

  // superadmin, can see all tenant roles and org roles
  if (isAdmin(currentUserId)) {
    const allTenantsExceptCurrent = Tenant.find({
      _id: { $ne: tenant._id },
      status: 'Active',
    }).fetch();
    allTenantsExceptCurrent.forEach((tenantExceptCurrent) => {
      roles = roles.concat(
        parseUserRoles(userToShow._id, tenantExceptCurrent.roles, tenantExceptCurrent.host),
      );

      roles = processOrgRoles(
        userToShow._id,
        tenantExceptCurrent.host,
        roles,
        tenantExceptCurrent.rolesUserInOrg,
      );
    });

    // root roles
    roles = roles.concat(parseUserRoles(userToShow._id, Meteor.settings.private.rolesGlobal));
  }

  const settings =
    userToShow.hosts &&
    userToShow.hosts[hostDotToUnderscore] &&
    userToShow.hosts[hostDotToUnderscore].settings;

  return {
    _id: userToShow._id,
    fullname: userToShow.profile.fullname,
    shortname: userToShow.profile.shortname,
    phone: userToShow.profile.phone,
    emailAddress: selfOrHostAdmin && userToShow.emails[0].address,
    roles,
    settings: selfOrHostAdmin && settings,
    // below is to comply with party type
    name: userToShow.profile.fullname,
    type: 'Member',
  };
};

const detailUser = (options, resolve, reject) => {
  try {
    checkOptions(options);

    const userToShow = Meteor.users.findOne(options.userIdToQuery);
    if (!userToShow) throw new Error('User not found!!!');

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const tenant = getTenant(host);

    resolve(action(userToShow, context, tenant, host));
  } catch (exception) {
    reject(`[detailUser] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailUser(options, resolve, reject);
  });
