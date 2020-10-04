import { Meteor } from 'meteor/meteor';

import Org from '../../index';

import entityUpdate from '../../../../../helpers/server/entityUpdate';

const processOrgToClosed = (org, tenant, party) => {
  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Org,
    { _id: org._id },
    {
      status: 'Processing',
    },
    'Set Org to Processing',
    party,
  );

  // remove all roles
  Meteor.roleAssignment.remove({ 'user._id': `${org._id}.org` });
  Meteor.roleAssignment.remove({ scope: new RegExp(`${org._id}.org`) });

  entityUpdate(
    Org,
    { _id: org._id },
    {
      status: 'Closed',
    },
    'Set Org to Closed',
    party,
  );

  return Org.findOne(org._id);
};

export default processOrgToClosed;
