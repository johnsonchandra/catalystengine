import File from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processFileToActive = (file, party) => {
  if (file.status === 'Processing')
    throw new Error('File is in other process. Please wait and repeat');

  if (!(file.status === 'Draft' || file.status === 'Queue'))
    throw new Error(`File status: ${file.status} may not be set to Active`);

  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    File,
    { _id: file._id },
    {
      status: 'Processing',
    },
    'Processing processFileToActive',
    party,
    timestamp,
  );

  timestamp = new Date();

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
