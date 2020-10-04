import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counts } from 'meteor/tmeasday:publish-counts';

import getFileQueryAndProjection from '../processors/getFileQueryAndProjection';

import File from '../..';

const publishName = 'listFileCurrent';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    // this is just for file. if you dont need it, just look at listFileDraft
    const { query, projection } = getFileQueryAndProjection(publishName, props, this);

    Counts.publish(this, `${publishName}Count`, File.find(query));

    return File.find(query, projection);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
