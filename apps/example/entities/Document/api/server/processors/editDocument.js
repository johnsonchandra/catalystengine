import sanitizeHtml from 'sanitize-html';

import Document from '../../index';

import cleanseDocDiff from '../../../../../../common/helpers/cleanseDocDiff';
import entityUpdate from '../../../../../../common/helpers/server/entityUpdate';

const editDocument = (args, document, party, tenant) => {
  if (document.status === 'Processing')
    throw new Error('Document is in other process. Please wait and repeat');

  if (!(document.status === 'Draft' || document.status === 'Queue'))
    throw new Error(`Document status: ${document.status} cannot be edited anymore`);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Document,
    { _id: document._id },
    {
      status: 'Processing',
    },
    'Processing editDocument',
    party,
  );

  const { maximumFractionDigits } = tenant.settings;

  // eslint-disable-next-line no-param-reassign
  args.amount = +args.amount.toFixed(maximumFractionDigits);

  // eslint-disable-next-line no-param-reassign
  if (args.trxDate) args.trxDate = new Date(args.trxDate);

  const newDoc = cleanseDocDiff(args, document);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;
  newDoc.status = document.status;

  entityUpdate(
    Document,
    { _id: document._id },
    newDoc,
    `Document updated, status back to ${document.status}`,
    party,
  );
  return Document.findOne(args._id);
};

export default editDocument;
