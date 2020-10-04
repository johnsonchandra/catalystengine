import File from '../../index';

// import checkOptionsArgsId from '../../../../../../common/modules/checkOptionsArgsId';
import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import getProjection from '../../../../../helpers/getProjection';
import checkOptions from '../../../../../helpers/checkOptions';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';
import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const publishName = 'detailFile';
const action = (args, party, tenant) => {
  // toggle this if you want to enforce args._id n findOne
  // const query = {
  //   ...getFileJSONdefs(publishName, args).query,
  //   ...ownerQuery(tenant.owner),
  // };
  // const projection = getProjection(args);
  // return File.findOne(query, projection);

  const { fields } = getFileJSONdefs(publishName, args);
  const options = parsePropsToQueryOptions({ ...args, fields });

  return args && args._id
    ? File.findOne(
        {
          ...getFileJSONdefs(publishName, args).query,
          ...ownerQuery(tenant.owner),
        },
        getProjection(options),
      )
    : {};
};

const detailFile = (options, resolve, reject) => {
  try {
    // toggle this if you want to enforce args._id n findOne
    // checkOptions(options, checkOptionsArgsId);

    checkOptions(options);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getFileJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);
    const tenant = getTenant(host);

    resolve(action(options, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailFile(options, resolve, reject);
  });
