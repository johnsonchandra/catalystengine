import Document from '../../index';

import parseHost from '../../../../../../common/helpers/parseHost';
import getTenant from '../../../../../../common/helpers/getTenant';
import checkOptions from '../../../../../../common/helpers/checkOptions';
import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import parseMemberFromContext from '../../../../../../common/helpers/parseMemberFromContext';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import entityRemove from '../../../../../../common/helpers/server/entityRemove';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const publishName = 'removeDocument';
const action = (args, party, tenant) => {
  const query = {
    _id: args._id,
    status: 'Draft',
    ...ownerQuery(tenant.owner),
  };

  // const document = Document.findOne(query);
  // if (!document) throw new Error(`[${publishName}] Document not found`);
  // add additional check here if needed

  entityRemove(Document, query, 'Delete Document permanently', party);

  return args;
};

const removeDocument = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getDocumentJSONdefs(publishName).auth;

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
    removeDocument(options, resolve, reject);
  });
