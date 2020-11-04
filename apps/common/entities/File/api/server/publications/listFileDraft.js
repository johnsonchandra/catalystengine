import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import File from '../..';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

import pubProcessor from '../../../../../helpers/server/pubProcessor';

const publishName = 'listFileDraft';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessor(File, publishName, getFileJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
