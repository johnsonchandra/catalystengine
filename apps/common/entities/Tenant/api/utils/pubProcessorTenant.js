import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import parseHost from '../../../../helpers/parseHost';
import checkAuth from '../../../../helpers/checkAuth';
import parsePropsToQueryOptions from '../../../../helpers/parsePropsToQueryOptions';
import getProjection from '../../../../helpers/getProjection';

const pubProcessor = (Entity, publishName, getJSONdefs, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const roles = getJSONdefs(publishName).auth;

  if (roles) checkAuth(Meteor.user(), roles, host);

  const options = parsePropsToQueryOptions({ ...props, fields: getJSONdefs(publishName).fields });

  const query = {
    ...getJSONdefs(publishName, options).query,
  };
  if (options.search) query.$or = getJSONdefs(publishName, options).queryOr;

  Counts.publish(parent, `${publishName}Count`, Entity.find(query));

  return Entity.find(query, getProjection(options));
};

export default pubProcessor;
