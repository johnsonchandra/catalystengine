import Counter from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processCounterToClosed = (counter, tenant, party) => {
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
      status: 'Closed',
    },
    'Set Counter to Closed',
    party,
    timestamp,
  );

  return Counter.findOne(counter._id);
};

export default processCounterToClosed;
