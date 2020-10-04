import { Meteor } from 'meteor/meteor';

import './listTenantDraft';
import './listTenantCurrent';
import './listTenantHistory';

import Tenant from '../..';

import parseHost from '../../../../../helpers/parseHost';

Meteor.publish('app', function app() {
  return [
    Meteor.users.find({ _id: this.userId }),
    Tenant.find(
      { host: parseHost(this.connection.httpHeaders.host) },
      { fields: { host: 1, orgId: 1, name: 1, settings: 1 } },
    ),
  ];
});
