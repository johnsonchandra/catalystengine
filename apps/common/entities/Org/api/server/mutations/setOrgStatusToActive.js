import Org from '../..';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import processOrgToActive from '../processors/processOrgToActive';

const publishName = 'setOrgStatusToActive';
const action = (args, party, tenant) => {
  const org = Org.findOne({
    _id: args._id,
  });
  if (!org) throw new Error(`[${publishName}] Org not found`);
  if (!(org.status === 'Draft' || org.status === 'Queue'))
    throw new Error(`[${publishName}] Org cannot be edited anymore`);

  return processOrgToActive(org, tenant, party);
};

const setOrgStatusToActive = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getOrgJSONdefs(publishName).auth;

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
    setOrgStatusToActive(options, resolve, reject);
  });
