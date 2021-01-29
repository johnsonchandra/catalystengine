import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Tenant from '../..';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';
import pubProcessorTenant from '../../utils/pubProcessorTenant';

const publishName = 'listTenantProcessing';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessorTenant(Tenant, publishName, getTenantJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
