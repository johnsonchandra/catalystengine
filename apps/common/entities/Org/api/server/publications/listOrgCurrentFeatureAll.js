import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counts } from 'meteor/tmeasday:publish-counts';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';
import getQueryAndProjectionForRootAdmin from '../../../../../helpers/getQueryAndProjectionForRootAdmin';

import Org from '../..';

const publishName = 'listOrgCurrentFeatureAll';
Meteor.publish(publishName, function pub(props) {
  check(props, Object);
  try {
    const { query, projection } = getQueryAndProjectionForRootAdmin(
      publishName,
      props,
      getOrgJSONdefs,
    );

    Counts.publish(this, `${publishName}Count`, Org.find(query));

    return Org.find(query, projection);
  } catch (exception) {
    console.error(`PUBLISH EXCEPTION - ${publishName} - userId: ${Meteor.userId()}`, exception);
    return this.ready();
  }
});
