import Tenant from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import entityInsert from '../../../../../helpers/server/entityInsert';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';

const publishName = 'addTenant';
const action = (args, party) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    trxDate: now,
    type: 'Host',
    status: 'Draft',
  };

  const _id = entityInsert(Tenant, newDoc, 'Create new Tenant', party, party, now);

  return Tenant.findOne(_id);
};

const addTenant = (options, resolve, reject) => {
  try {
    checkOptions(options);

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
    addTenant(options, resolve, reject);
  });
