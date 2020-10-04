import File from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';
import entityRemove from '../../../../../helpers/server/entityRemove';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const publishName = 'removeFile';
const action = (args, party, tenant) => {
  const query = {
    _id: args._id,
    status: 'Draft',
    ...ownerQuery(tenant.owner),
  };

  // const file = File.findOne(query);
  // if (!file) throw new Error(`[${publishName}] File not found`);
  // add additional check here if needed

  entityRemove(File, query, 'Delete File permanently', party);

  return args;
};

const removeFile = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getFileJSONdefs(publishName).auth;

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
    removeFile(options, resolve, reject);
  });
