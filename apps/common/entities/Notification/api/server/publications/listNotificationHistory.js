import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Notification from '../..';

import getNotificationJSONdefs from '../../utils/getNotificationJSONdefs';
import pubProcessor from '../../../../../helpers/server/pubProcessor';

const publishName = 'listNotificationHistory';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessor(Notification, publishName, getNotificationJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
