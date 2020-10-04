import Counter from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processCounterToActive = (counter, tenant, party) => {
  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Counter,
    { _id: counter._id },
    {
      status: 'Processing',
    },
    'Set Counter to Processing',
    party,
    timestamp,
  );

  timestamp = new Date();

  entityUpdate(
    Counter,
    { _id: counter._id },
    {
      // postingDate,
      status: 'Active',
    },
    'Set Counter to Active',
    party,
    timestamp,
  );

  return Counter.findOne(counter._id);
};

export default processCounterToActive;
