import { Roles } from 'meteor/alanning:roles';

import Org from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

const processOrgToActive = (org, tenant, party) => {
  // now do last check
  if (org.status === 'Processing')
    throw new Error('Trx is in other process. Please wait and repeat');

  if (!(org.status === 'Draft' || org.status === 'Queue'))
    throw new Error(`Org status: ${org.status} may not be set to Active`);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Org,
    { _id: org._id },
    {
      status: 'Processing',
    },
    'Processing processOrgToActive',
    party,
  );

  const now = new Date();

  const doc = {
    status: 'Active',
  };
  doc[`hosts.${parseDotToUnderscore(tenant.host)}.status`] = 'Active';
  doc[`hosts.${parseDotToUnderscore(tenant.host)}.activedAt`] = now;
  doc[`hosts.${parseDotToUnderscore(tenant.host)}.activedBy`] = party.name;

  entityUpdate(Org, { _id: org._id }, doc, 'Set Org to Active', party, now);

  Roles.addUsersToRoles(`${org._id}.org`, tenant.rolesOrgInTenant[0], tenant.host); // just get the first role

  return Org.findOne(org._id);
};

export default processOrgToActive;
