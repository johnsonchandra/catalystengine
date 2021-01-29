import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Counter from '../..';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';
import pubProcessor from '../../../../../helpers/server/pubProcessor';

const publishName = 'listCounterProcessing';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessor(Counter, publishName, getCounterJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
