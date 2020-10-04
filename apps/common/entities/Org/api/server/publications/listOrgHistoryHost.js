import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Org from '../../index';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';
import pubProcessorOrgByHost from '../../utils/pubProcessorOrgByHost';

const publishName = 'listOrgHistoryHost';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessorOrgByHost(Org, publishName, getOrgJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
