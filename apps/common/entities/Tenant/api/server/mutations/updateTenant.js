import sanitizeHtml from 'sanitize-html';

import Tenant from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';

const publishName = 'updateTenant';
const action = (args, party) => {
  const tenant = Tenant.findOne({
    _id: args._id,
  });
  if (!tenant) throw new Error(`[${publishName}] Tenant not found`);
  if (!(tenant.status === 'Draft' || tenant.status === 'Queue'))
    throw new Error(`[${publishName}] Tenant cannot be edited anymore`);
  if (tenant.status === 'Processing')
    throw new Error(`[${publishName}] Tenant is in other process. Please wait and repeat`);

  // eslint-disable-next-line no-param-reassign
  if (args.trxDate) args.trxDate = new Date(args.trxDate);

  // const { fromDate, thruDate, maxForward, maximumFractionDigits } = tenant.settings;

  // eslint-disable-next-line no-param-reassign
  // args.amount = +args.amount.toFixed(maximumFractionDigits);

  const newDoc = cleanseDocDiff(args, tenant);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(Tenant, { _id: tenant._id }, newDoc, 'Updating Tenant', party);

  return Tenant.findOne(args._id);
};

const updateTenant = (options, resolve, reject) => {
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
    updateTenant(options, resolve, reject);
  });
