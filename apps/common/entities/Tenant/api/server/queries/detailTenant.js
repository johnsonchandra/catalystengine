import Tenant from '../../index';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import parseHost from '../../../../../helpers/parseHost';
import getProjection from '../../../../../helpers/getProjection';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';
import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';

const publishName = 'detailTenant';
const action = (args) => {
  const { fields, query } = getTenantJSONdefs(publishName, args);
  const options = parsePropsToQueryOptions({ ...args, fields });

  return Tenant.findOne(query, getProjection(options));
};

const detailTenant = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getTenantJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    resolve(action(options));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailTenant(options, resolve, reject);
  });
