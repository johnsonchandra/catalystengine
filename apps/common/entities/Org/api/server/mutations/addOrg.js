import Org from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import entityInsert from '../../../../../helpers/server/entityInsert';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

const publishName = 'addOrg';
const action = (args, host, party) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    logoUrl: '/common/img/50x50.png',
    type: 'Company',
    status: 'Draft',
    hosts: {},
  };

  const hostDotToUnderscore = parseDotToUnderscore(host);
  newDoc.hosts[hostDotToUnderscore] = {
    status: 'Draft',
    createdAt: new Date(),
    createdBy: party.name,
  };

  const _id = entityInsert(Org, newDoc, 'Create new Org', party, undefined, now);

  return Org.findOne(_id);
};

const addOrg = (options, resolve, reject) => {
  try {
    checkOptions(options);

    const { args, context } = options;

    const host = parseHost(context.headers.origin);

    const roles = getOrgJSONdefs(publishName).auth;
    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);

    resolve(action(args, host, party));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    addOrg(options, resolve, reject);
  });
