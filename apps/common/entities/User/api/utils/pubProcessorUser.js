import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import parsePropsToQueryOptions from '../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../helpers/parseHost';
import checkAuth from '../../../../helpers/checkAuth';
import getProjection from '../../../../helpers/getProjection';
import parseDotToUnderscore from '../../../../helpers/parseDotToUnderscore';

const pubProcessorUser = (Entity, publishName, getJSONdefs, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { auth, fields } = getJSONdefs(publishName, { ...props, _id: Meteor.userId() });

  if (auth) checkAuth(Meteor.user(), auth, host);

  const fieldHost = `hosts.${parseDotToUnderscore(host)}`;
  fields[fieldHost] = 1;

  const options = parsePropsToQueryOptions({ ...props, fields });

  const query = {
    ...getJSONdefs(publishName, { ...options, _id: Meteor.userId() }).query,
  };
  query[fieldHost] = { $exists: true };

  if (options.search) query.$or = getJSONdefs(publishName, options).queryOr;

  Counts.publish(parent, `${publishName}Count`, Entity.find(query));

  return Entity.find(query, getProjection(options));
};

export default pubProcessorUser;
