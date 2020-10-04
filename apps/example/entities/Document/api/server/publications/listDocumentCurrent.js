import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counts } from 'meteor/tmeasday:publish-counts';

import getDocumentQueryAndProjection from '../processors/getDocumentQueryAndProjection';

import Document from '../..';

const publishName = 'listDocumentCurrent';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    // this is just for document. if you dont need it, just look at listDocumentDraft
    const { query, projection } = getDocumentQueryAndProjection(publishName, props, this);

    Counts.publish(this, `${publishName}Count`, Document.find(query));

    return Document.find(query, projection);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
