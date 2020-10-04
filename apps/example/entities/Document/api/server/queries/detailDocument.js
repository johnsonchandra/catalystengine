import Document from '../../index';

// import checkOptionsArgsId from '../../../../../../common/modules/checkOptionsArgsId';
import parseHost from '../../../../../../common/helpers/parseHost';
import getTenant from '../../../../../../common/helpers/getTenant';
import getProjection from '../../../../../../common/helpers/getProjection';
import checkOptions from '../../../../../../common/helpers/checkOptions';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import parseMemberFromContext from '../../../../../../common/helpers/parseMemberFromContext';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import parsePropsToQueryOptions from '../../../../../../common/helpers/parsePropsToQueryOptions';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const publishName = 'detailDocument';
const action = (args, party, tenant) => {
  // toggle this if you want to enforce args._id n findOne
  // const query = {
  //   ...getDocumentJSONdefs(publishName, args).query,
  //   ...ownerQuery(tenant.owner),
  // };
  // const projection = getProjection(args);
  // return Document.findOne(query, projection);

  const { fields } = getDocumentJSONdefs(publishName, args);
  const options = parsePropsToQueryOptions({ ...args, fields });

  return args && args._id
    ? Document.findOne(
        {
          ...getDocumentJSONdefs(publishName, args).query,
          ...ownerQuery(tenant.owner),
        },
        getProjection(options),
      )
    : {};
};

const detailDocument = (options, resolve, reject) => {
  try {
    // toggle this if you want to enforce args._id n findOne
    // checkOptions(options, checkOptionsArgsId);

    checkOptions(options);

    const { context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getDocumentJSONdefs(publishName).auth;

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
    detailDocument(options, resolve, reject);
  });
