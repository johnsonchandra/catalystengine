import sanitizeHtml from 'sanitize-html';

import Document from '../../index';

import cleanseDocDiff from '../../../../../../common/helpers/cleanseDocDiff';
import parseHost from '../../../../../../common/helpers/parseHost';
import entityUpdate from '../../../../../../common/helpers/server/entityUpdate';
import getTenant from '../../../../../../common/helpers/getTenant';
import checkOptions from '../../../../../../common/helpers/checkOptions';
import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import parseMemberFromContext from '../../../../../../common/helpers/parseMemberFromContext';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const publishName = 'updateDocument';
const action = (args, party, tenant) => {
  const document = Document.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!document) throw new Error(`[${publishName}] Document not found`);
  if (!(document.status === 'Draft' || document.status === 'Queue'))
    throw new Error(`[${publishName}] Document cannot be edited anymore`);
  if (document.status === 'Processing')
    throw new Error(`[${publishName}] Document is in other process. Please wait and repeat`);

  // eslint-disable-next-line no-param-reassign
  if (args.trxDate) args.trxDate = new Date(args.trxDate);

  // const { fromDate, thruDate, maxForward, maximumFractionDigits } = tenant.settings;

  // eslint-disable-next-line no-param-reassign
  // args.amount = +args.amount.toFixed(maximumFractionDigits);

  const newDoc = cleanseDocDiff(args, document);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(Document, { _id: document._id }, newDoc, 'Updating Document', party);

  // document if you want to update other related entities
  // entityUpdate(
  //   AccountMovement,
  //   { DocumentId: newDocument._id },
  //   {
  //     document: {
  //       nr: newDocument.nr,
  //       name: newDocument.name,
  //     },
  //   },
  //   'Update AccountMovement cause Document updated',
  //   party,
  //   newDocument.updatedAt,
  //   { multi: true },
  // );

  return Document.findOne(args._id);
};

const updateDocument = (options, resolve, reject) => {
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
    updateDocument(options, resolve, reject);
  });
