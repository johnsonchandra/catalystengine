import Tenant from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processTenantToClosed = (party, tenant) => {
  let timestamp = new Date();

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Tenant,
    { _id: tenant._id },
    {
      status: 'Processing',
    },
    'Processing processTenantToClosed',
    party,
    timestamp,
  );

  timestamp = new Date();

  entityUpdate(
    Tenant,
    { _id: tenant._id },
    {
      // postingDate,
      status: 'Closed',
    },
    'Set Tenant to Closed',
    party,
    timestamp,
  );

  return Tenant.findOne(tenant._id);
};

export default processTenantToClosed;
