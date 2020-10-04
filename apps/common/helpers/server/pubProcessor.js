import { Counts } from 'meteor/tmeasday:publish-counts';

import { Meteor } from 'meteor/meteor';
import parsePropsToQueryOptions from '../parsePropsToQueryOptions';
import parseHost from '../parseHost';
import checkAuth from '../checkAuth';
import getProjection from '../getProjection';
import getTenant from '../getTenant';
import ownerQuery from '../ownerQuery';

const pubProcessor = (Entity, publishName, getJSONdefs, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const roles = getJSONdefs(publishName).auth;

  if (roles) checkAuth(Meteor.user(), roles, host);

  const tenant = getTenant(host);
  const options = parsePropsToQueryOptions({ ...props, fields: getJSONdefs(publishName).fields });

  const query = {
    ...getJSONdefs(publishName, options).query,
    ...ownerQuery(tenant.owner),
  };
  if (options.search) query.$or = getJSONdefs(publishName, options).queryOr;

  Counts.publish(parent, `${publishName}Count`, Entity.find(query));

  return Entity.find(query, getProjection(options));
};

export default pubProcessor;
