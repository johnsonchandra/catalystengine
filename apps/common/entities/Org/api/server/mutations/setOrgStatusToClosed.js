import Org from '../..';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import processOrgToClosed from '../processors/processOrgToClosed';

const publishName = 'setOrgStatusToClosed';
const action = (args, party, tenant) => {
  const org = Org.findOne({
    _id: args._id,
  });
  if (!org) throw new Error(`[${publishName}] Org not found`);
  if (org.status === 'Processing')
    throw new Error(`[${publishName}] Org is in other process. Please wait and repeat`);

  return processOrgToClosed(org, tenant, party);
};

const setOrgStatusToClosed = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getOrgJSONdefs(publishName).auth;

    checkAuth(context.user, roles); // host is purposely undefined here to enforce Global Roles

    const party = parseMemberFromContext(context);
    const tenant = getTenant(host);

    resolve(action(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setOrgStatusToClosed(options, resolve, reject);
  });
