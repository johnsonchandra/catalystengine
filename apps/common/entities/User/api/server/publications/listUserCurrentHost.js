import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import getUserJSONdefs from '../../utils/getUserJSONdefs';
import pubProcessorUser from '../../utils/pubProcessorUser';

const publishName = 'listUserCurrentHost';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessorUser(Meteor.users, publishName, getUserJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
