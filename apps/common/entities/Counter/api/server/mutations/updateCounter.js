import sanitizeHtml from 'sanitize-html';

import Counter from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

const publishName = 'updateCounter';
const action = (args, party, tenant) => {
  const counter = Counter.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!counter) throw new Error(`[${publishName}] Counter not found`);
  if (!(counter.status === 'Draft' || counter.status === 'Queue'))
    throw new Error(`[${publishName}] Counter cannot be edited anymore`);
  if (counter.status === 'Processing')
    throw new Error(`[${publishName}] Counter is in other process. Please wait and repeat`);

  // eslint-disable-next-line no-param-reassign
  if (args.trxDate) args.trxDate = new Date(args.trxDate);

  const newDoc = cleanseDocDiff(args, counter);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(Counter, { _id: counter._id }, newDoc, 'Updating Counter', party);

  return Counter.findOne(args._id);
};

const updateCounter = (options, resolve, reject) => {
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
    updateCounter(options, resolve, reject);
  });
