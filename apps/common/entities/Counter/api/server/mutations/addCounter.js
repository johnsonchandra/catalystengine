import Counter from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import entityInsert from '../../../../../helpers/server/entityInsert';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

const publishName = 'addCounter';
const action = (args, party, tenant) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    trxDate: now,
    type: 'Manual',
    status: 'Draft',
  };

  const _id = entityInsert(Counter, newDoc, 'Create new Counter', party, tenant.owner, now);

  return Counter.findOne(_id);
};

const addCounter = (options, resolve, reject) => {
  try {
    checkOptions(options);

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
    addCounter(options, resolve, reject);
  });
