import _ from 'lodash';

import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import checkOptions from '../../../../../helpers/checkOptions';
import isAdmin from '../../../../../helpers/isAdmin';
import processRoles from '../../../../../helpers/server/processRoles';

import Org from '../..';
import Tenant from '../../../../Tenant/api';

const updateRoles = ({ _id, roles }, party, host) => {
  const org = Org.findOne(_id);
  const scopes = _.groupBy(roles, 'name');

  processRoles(`${_id}.org`, scopes, host, `${org.name} at ${host}`);

  if (isAdmin(party._id)) {
    const tenantOthers = Tenant.find({ host: { $ne: host } }).fetch();
    tenantOthers.forEach((tenantOther) => {
      processRoles(`${_id}.org`, scopes, tenantOther.host, `${org.name} at ${tenantOther.host}`);
    });
  }

  return entityUpdate(Org, { _id }, {}, `update roles to ${JSON.stringify(roles)}`, party);
};

const updateOrgRoles = (options, resolve, reject) => {
  try {
    checkOptions(options, (params) => {
      if (!params.args) throw new Error('args is required.');
      if (!params.args.party) throw new Error('args.party is required.');
    });

    const { args, context } = options;
    const host = parseHost(context.headers.origin);

    // only admin can update roles
    if (!isAdmin(context.user._id, host))
      throw new Error('You dont have the authorization to update Org Roles');

    const rolesInJSONArray = args.party.roles.map((role) => JSON.parse(role));
    const party = parseMemberFromContext(context);

    if (rolesInJSONArray)
      updateRoles({ _id: args.party._id, roles: rolesInJSONArray }, party, host);

    resolve();
  } catch (exception) {
    reject(`[updateOrgRoles] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateOrgRoles(options, resolve, reject);
  });
