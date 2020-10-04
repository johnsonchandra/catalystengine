import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counts } from 'meteor/tmeasday:publish-counts';

import getCounterQueryAndProjection from '../processors/getCounterQueryAndProjection';

import Counter from '../..';

const publishName = 'listCounterCurrent';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    // this is just for counter. if you dont need it, just look at listCounterDraft
    const { query, projection } = getCounterQueryAndProjection(publishName, props, this);

    Counts.publish(this, `${publishName}Count`, Counter.find(query));

    return Counter.find(query, projection);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
