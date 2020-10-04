import Org from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import getProjection from '../../../../../helpers/getProjection';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';
import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import isAdmin from '../../../../../helpers/isAdmin';
import parseUserRoles from '../../../../../helpers/parseUserRoles';
import Tenant from '../../../../Tenant/api';

const publishName = 'detailOrg';
const action = (args, party, tenant) => {
  const { fields, query } = getOrgJSONdefs(publishName, args);
  const options = parsePropsToQueryOptions({ ...args, fields });

  if (!(args && args._id)) return {};

  const org = Org.findOne(query, getProjection(options));

  // host admin
  if (isAdmin(party._id, tenant.host)) {
    // parse Org Roles in Host
    org.roles = parseUserRoles(
      `${org._id}.org`,
      tenant.rolesOrgInTenant,
      tenant.host,
      `${org.name} at ${tenant.host}`,
    );
  }

  // root admin
  if (isAdmin(party._id)) {
    const allTenantsExceptCurrent = Tenant.find({
      _id: { $ne: tenant._id },
      status: 'Active',
    }).fetch();

    allTenantsExceptCurrent.forEach((tenantExceptCurrent) => {
      org.roles = org.roles.concat(
        parseUserRoles(
          `${org._id}.org`,
          tenantExceptCurrent.rolesOrgInTenant,
          tenantExceptCurrent.host,
          `${org.name} at ${tenantExceptCurrent.host}`,
        ),
      );
    });
  }

  return org;
};

const detailOrg = (options, resolve, reject) => {
  try {
    checkOptions(options);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getOrgJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);
    const tenant = getTenant(host);

    resolve(action(options, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailOrg(options, resolve, reject);
  });
