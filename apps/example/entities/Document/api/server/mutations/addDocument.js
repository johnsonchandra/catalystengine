import Document from '../../index';

import parseHost from '../../../../../../common/helpers/parseHost';
import entityInsert from '../../../../../../common/helpers/server/entityInsert';
import getTenant from '../../../../../../common/helpers/getTenant';
import checkOptions from '../../../../../../common/helpers/checkOptions';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import parseMemberFromContext from '../../../../../../common/helpers/parseMemberFromContext';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const publishName = 'addDocument';
const action = (args, party, tenant) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    trxDate: now,
    type: 'Manual',
    status: 'Draft',
  };

  const _id = entityInsert(Document, newDoc, 'Create new Document', party, tenant.owner, now);

  return Document.findOne(_id);
};

const addDocument = (options, resolve, reject) => {
  try {
    checkOptions(options);

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
    addDocument(options, resolve, reject);
  });
