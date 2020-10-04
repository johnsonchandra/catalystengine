import File from '../../index';

// import entityUpdate from '../../../../../../common/modules/server/entityUpdate';
import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

import processFileToActive from '../processors/processFileToActive';

const publishName = 'setFileStatusToActive';
const action = (args, party, tenant) => {
  const file = File.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!file) throw new Error(`[${publishName}] File not found`);
  if (!(file.status === 'Draft' || file.status === 'Queue'))
    throw new Error(`[${publishName}] File cannot be edited anymore`);

  // toggle this if needed to prevent race-condition
  // const countPendingFiles = File.find({
  //   status: 'Processing',
  //   ...ownerQuery(tenant.owner),
  // }).count();
  //
  // if (countPendingFiles > 0) {
  //   entityUpdate(
  //     File,
  //     { _id: file._id },
  //     { status: 'Queue' },
  //     'Set File status to Queue',
  //     party,
  //   );
  //   return File.findOne(file._id);
  // }

  return processFileToActive(file, tenant, party);
};

const setFileStatusToActive = (options, resolve, reject) => {
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
    setFileStatusToActive(options, resolve, reject);
  });
