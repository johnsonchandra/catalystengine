import { Meteor } from 'meteor/meteor';

import _ from 'lodash';

import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import checkOptions from '../../../../../helpers/checkOptions';
import isAdmin from '../../../../../helpers/isAdmin';
import getQueryHostExist from '../../../../../helpers/getQueryHostExist';
import processRoles from '../../../../../helpers/server/processRoles';

import Tenant from '../../../../Tenant/api';
import Org from '../../../../Org/api';

const processOrgRoles = (_id, scopes, host) => {
  const orgs = Org.find(getQueryHostExist(host), {
    fields: { _id: 1, name: 1 },
  }).fetch();

  orgs.forEach((org) => {
    const scope = `${org._id}.org.${host}`;
    const name = `${org.name} at ${host}`;
    processRoles(_id, scopes, scope, name);
  });
};

// only update roles of current host
const updateRoles = ({ _id, roles }, party, host) => {
  const scopes = _.groupBy(roles, 'name');

  // set roles for current Host
  processRoles(_id, scopes, host);

  // set roles for current Org Host
  processOrgRoles(_id, scopes, host);

  // only super admin may set roles for all other hosts
  if (isAdmin(party._id)) {
    const tenantOthers = Tenant.find({ host: { $ne: host } }).fetch();
    tenantOthers.forEach((tenantOther) => {
      processRoles(_id, scopes, tenantOther.host);
      processOrgRoles(_id, scopes, tenantOther.host);
    });
  }

  return entityUpdate(Meteor.users, { _id }, {}, `update roles to ${JSON.stringify(roles)}`, party);
};

const updateUserRoles = (options, resolve, reject) => {
  try {
    checkOptions(options, (params) => {
      if (!params.args) throw new Error('args is required.');
      if (!params.args.party) throw new Error('args.party is required.');
    });

    const { args, context } = options;
    const host = parseHost(context.headers.origin);

    // only admin can update roles
    if (!isAdmin(context.user._id, host))
      throw new Error('You dont have the authorization to update User Roles');

    const rolesInJSONArray = args.party.roles.map((role) => JSON.parse(role));
    const party = parseMemberFromContext(context);

    if (rolesInJSONArray)
      updateRoles({ _id: args.party._id, roles: rolesInJSONArray }, party, host);

    resolve();
  } catch (exception) {
    reject(`[updateUserRoles] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateUserRoles(options, resolve, reject);
  });
