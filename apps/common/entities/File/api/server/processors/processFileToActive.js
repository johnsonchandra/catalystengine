import File from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processFileToActive = (file, tenant, party) => {
  let timestamp = new Date();

  // add additional steps here if necessary
  // if (
  //   !(
  //     setRelatedAccountsToProcessing(file, accountMovements, tenant, party, timestamp) &&
  //     setRelatedAccountMovementsToProcessing(file, accountMovements, tenant, party, timestamp)
  //   )
  // )
  //   return File.findOne(file._id);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    File,
    { _id: file._id },
    {
      status: 'Processing',
    },
    'Set File to Processing',
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
  //   processAccountMovementToActive(file, accountMovement, postingDate, tenant, party, timestamp);
  // });

  entityUpdate(
    File,
    { _id: file._id },
    {
      // postingDate,
      status: 'Active',
    },
    'Set File to Active',
    party,
    timestamp,
  );

  return File.findOne(file._id);
};

export default processFileToActive;
