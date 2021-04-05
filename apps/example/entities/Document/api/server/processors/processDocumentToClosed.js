import Document from '../../index';

import entityUpdate from '../../../../../../common/helpers/server/entityUpdate';

// FIXME rubah tenant, party to party, tenant di catalyst
const processDocumentToClosed = (document, party) => {
  if (document.status === 'Processing')
    throw new Error('Document is in other process. Please wait and repeat');

  // if (!(document.status === 'Active' || document.status === 'Delivering'))
  if (document.status !== 'Active')
    throw new Error(`Document status: ${document.status} may not be set to Closed`);

  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Document,
    { _id: document._id },
    {
      status: 'Processing',
    },
    'Processing processDocumentToClosed',
    party,
    timestamp,
  );

  timestamp = new Date();

  // add additional steps here if necessary

  entityUpdate(
    Document,
    { _id: document._id },
    {
      status: 'Closed',
    },
    'Set Document to Closed',
    party,
    timestamp,
  );

  return Document.findOne(document._id);
};

export default processDocumentToClosed;
