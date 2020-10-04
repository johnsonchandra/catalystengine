import { Counts } from 'meteor/tmeasday:publish-counts';

import { Meteor } from 'meteor/meteor';
import parsePropsToQueryOptions from '../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../helpers/parseHost';
import checkAuth from '../../../../helpers/checkAuth';
import getProjection from '../../../../helpers/getProjection';
import parseDotToUnderscore from '../../../../helpers/parseDotToUnderscore';

const pubProcessorOrgByHost = (Entity, publishName, getJSONdefs, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const roles = getJSONdefs(publishName).auth;

  if (roles) checkAuth(Meteor.user(), roles, host);

  const fieldHost = `hosts.${parseDotToUnderscore(host)}`;
  const { fields } = getJSONdefs(publishName);
  fields[fieldHost] = 1;

  const options = parsePropsToQueryOptions({ ...props, fields });

  const query = {
    ...getJSONdefs(publishName, options).query,
  };
  query[fieldHost] = { $exists: true };

  if (options.search) query.$or = getJSONdefs(publishName, options).queryOr;

  Counts.publish(parent, `${publishName}Count`, Entity.find(query));

  return Entity.find(query, getProjection(options));
};

export default pubProcessorOrgByHost;
