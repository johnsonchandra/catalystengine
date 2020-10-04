import File from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import entityInsert from '../../../../../helpers/server/entityInsert';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const publishName = 'addFile';
const action = (args, party, tenant) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    trxDate: now,
    type: 'Manual',
    status: 'Draft',
  };

  const _id = entityInsert(File, newDoc, 'Create new File', party, tenant.owner, now);

  return File.findOne(_id);
};

const addFile = (options, resolve, reject) => {
  try {
    checkOptions(options);

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
    addFile(options, resolve, reject);
  });
