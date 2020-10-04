import Tenant from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import entityRemove from '../../../../../helpers/server/entityRemove';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';

const publishName = 'removeTenant';
const action = (args, party) => {
  const query = {
    _id: args._id,
    status: 'Draft',
  };

  entityRemove(Tenant, query, 'Delete Tenant permanently', party);

  return args;
};

const removeTenant = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getTenantJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);

    resolve(action(args, party));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeTenant(options, resolve, reject);
  });
