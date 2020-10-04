import Document from '../../index';

import entityUpdate from '../../../../../../common/helpers/server/entityUpdate';

const processDocumentToActive = (document, tenant, party) => {
  let timestamp = new Date();

  // add additional steps here if necessary
  // if (
  //   !(
  //     setRelatedAccountsToProcessing(document, accountMovements, tenant, party, timestamp) &&
  //     setRelatedAccountMovementsToProcessing(document, accountMovements, tenant, party, timestamp)
  //   )
  // )
  //   return Document.findOne(document._id);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Document,
    { _id: document._id },
    {
      status: 'Processing',
    },
    'Set Document to Processing',
    party,
    timestamp,
  );

  timestamp = new Date();

  // add additional steps here if necessary
  // let postingDate = timestamp;
  // if (tenant.settings.accountMovementMode === 'postingDate') {
  //   const maxPostingDate = tenant.settings.thruDate;
  //   maxPostingDate.setSeconds(maxPostingDate.getSeconds() - 1);
  //   if (postingDate > maxPostingDate) postingDate = maxPostingDate;
  // }
  //
  // accountMovements.forEach((accountMovement) => {
  //   processAccountMovementToActive(document, accountMovement, postingDate, tenant, party, timestamp);
  // });

  entityUpdate(
    Document,
    { _id: document._id },
    {
      // postingDate,
      status: 'Active',
    },
    'Set Document to Active',
    party,
    timestamp,
  );

  return Document.findOne(document._id);
};

export default processDocumentToActive;
