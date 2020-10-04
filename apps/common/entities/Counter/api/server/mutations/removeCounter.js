import Counter from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';
import entityRemove from '../../../../../helpers/server/entityRemove';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

const publishName = 'removeCounter';
const action = (args, party, tenant) => {
  const query = {
    _id: args._id,
    status: 'Draft',
    ...ownerQuery(tenant.owner),
  };

  entityRemove(Counter, query, 'Delete Counter permanently', party);

  return args;
};

const removeCounter = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getCounterJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);
    const tenant = getTenant(host);

    resolve(action(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeCounter(options, resolve, reject);
  });
