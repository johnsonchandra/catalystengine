import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counts } from 'meteor/tmeasday:publish-counts';

import getNotificationQueryAndProjection from '../processors/getNotificationQueryAndProjection';

import Notification from '../..';

const publishName = 'listNotificationCurrent';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    // this is just for notification. if you dont need it, just look at listNotificationDraft
    const { query, projection } = getNotificationQueryAndProjection(publishName, props, this);

    Counts.publish(this, `${publishName}Count`, Notification.find(query));

    return Notification.find(query, projection);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
