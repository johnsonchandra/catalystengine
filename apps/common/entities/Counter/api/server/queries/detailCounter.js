import Counter from '../../index';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import getProjection from '../../../../../helpers/getProjection';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

const publishName = 'detailCounter';
const action = (args, party, tenant) => {
  const query = {
    ...getCounterJSONdefs(publishName, args).query,
    ...ownerQuery(tenant.owner),
  };
  const projection = getProjection(args);
  return Counter.findOne(query, projection);
};

const detailCounter = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getCounterJSONdefs(publishName).auth;

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
    detailCounter(options, resolve, reject);
  });
