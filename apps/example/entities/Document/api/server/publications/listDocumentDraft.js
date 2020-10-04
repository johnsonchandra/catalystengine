import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Document from '../..';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';
import pubProcessor from '../../../../../../common/helpers/server/pubProcessor';

const publishName = 'listDocumentDraft';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    return pubProcessor(Document, publishName, getDocumentJSONdefs, props, this);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
