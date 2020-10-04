import Document from '../..';

// import entityUpdate from '../../../../../../common/modules/server/entityUpdate';
import parseHost from '../../../../../../common/helpers/parseHost';
import getTenant from '../../../../../../common/helpers/getTenant';
import checkOptions from '../../../../../../common/helpers/checkOptions';
import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import parseMemberFromContext from '../../../../../../common/helpers/parseMemberFromContext';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

import processDocumentToClosed from '../processors/processDocumentToClosed';

const publishName = 'setDocumentStatusToClosed';
const action = (args, party, tenant) => {
  const document = Document.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!document) throw new Error(`[${publishName}] Document not found`);
  if (document.status === 'Processing')
    throw new Error(`[${publishName}] Document is in other process. Please wait and repeat`);

  // toggle this if needed to prevent race-condition
  // const countPendingDocuments = Document.find({
  //   status: 'Processing',
  //   ...ownerQuery(tenant.owner),
  // }).count();
  //
  // if (countPendingDocuments > 0) {
  //   entityUpdate(
  //     Document,
  //     { _id: document._id },
  //     { status: 'Queue' },
  //     'Set Document status to Queue',
  //     party,
  //   );
  //   return Document.findOne(document._id);
  // }

  return processDocumentToClosed(document, tenant, party);
};

const setDocumentStatusToClosed = (options, resolve, reject) => {
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
    setDocumentStatusToClosed(options, resolve, reject);
  });
