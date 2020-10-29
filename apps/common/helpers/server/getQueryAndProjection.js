import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../parsePropsToQueryOptions';
import parseHost from '../parseHost';
import checkAuth from '../checkAuth';
import getProjection from '../getProjection';
import getTenant from '../getTenant';
import ownerQuery from '../ownerQuery';

const getQueryAndProjection = (publishName, getJSONdefs, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getJSONdefs(publishName);

  if (auth) checkAuth(Meteor.user(), auth, host);

  const tenant = getTenant(host);
  const options = parsePropsToQueryOptions({ ...props, fields });

  const query = {
    ...getJSONdefs(publishName, options).query,
    ...ownerQuery(tenant.owner),
  };
  if (options.search) query.$or = getJSONdefs(publishName, options).queryOr;

  const projection = getProjection(options);

  return { query, projection };
};

export default getQueryAndProjection;
