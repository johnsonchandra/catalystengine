import Counter from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

import processCounterToActive from '../processors/processCounterToActive';

const publishName = 'setCounterStatusToActive';
const action = (args, party, tenant) => {
  const counter = Counter.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!counter) throw new Error(`[${publishName}] Counter not found`);
  if (!(counter.status === 'Draft' || counter.status === 'Queue'))
    throw new Error(`[${publishName}] Counter cannot be edited anymore`);

  return processCounterToActive(counter, tenant, party);
};

const setCounterStatusToActive = (options, resolve, reject) => {
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
    setCounterStatusToActive(options, resolve, reject);
  });
