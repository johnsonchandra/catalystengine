import Org from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import entityRemove from '../../../../../helpers/server/entityRemove';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

const publishName = 'removeOrg';
const action = (args, party) => {
  const query = {
    _id: args._id,
    status: 'Draft',
  };

  entityRemove(Org, query, 'Delete Org permanently', party);

  return args;
};

const removeOrg = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getOrgJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);

    resolve(action(args, party));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeOrg(options, resolve, reject);
  });
