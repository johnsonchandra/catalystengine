import sanitizeHtml from 'sanitize-html';

import Org from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

const publishName = 'updateOrg';
const action = (args, host, party) => {
  const org = Org.findOne({
    _id: args._id,
  });
  if (!org) throw new Error(`[${publishName}] Org not found`);
  if (!(org.status === 'Draft' || org.status === 'Queue'))
    throw new Error(`[${publishName}] Org cannot be edited anymore`);
  if (org.status === 'Processing')
    throw new Error(`[${publishName}] Org is in other process. Please wait and repeat`);

  const newDoc = cleanseDocDiff(args, org);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  const hostDotToUnderscore = parseDotToUnderscore(host);

  if (!(org.hosts && org.hosts[hostDotToUnderscore])) {
    newDoc[`hosts.${hostDotToUnderscore}`] = {
      status: 'Draft',
      createdAt: new Date(),
      createdBy: party.name,
    };
  }

  entityUpdate(Org, { _id: org._id }, newDoc, 'Updating Org', party);
  return { _id: args._id };
};

const updateOrg = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

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
    updateOrg(options, resolve, reject);
  });
