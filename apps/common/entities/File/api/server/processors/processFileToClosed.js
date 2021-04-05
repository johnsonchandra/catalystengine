import File from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processFileToClosed = (file, party) => {
  if (file.status === 'Processing')
    throw new Error('File is in other process. Please wait and repeat');

  if (file.status !== 'Active')
    throw new Error(`File status: ${file.status} may not be set to Closed`);

  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    File,
    { _id: file._id },
    {
      status: 'Processing',
    },
    'Processing processFiletoClosed',
    party,
    timestamp,
  );

  timestamp = new Date();

  entityUpdate(
    File,
    { _id: file._id },
    {
      // postingDate,
      status: 'Closed',
    },
    'Set File to Closed',
    party,
    timestamp,
  );

  return File.findOne(file._id);
};

export default processFileToClosed;
