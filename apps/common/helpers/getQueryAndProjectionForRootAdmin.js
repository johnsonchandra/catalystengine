import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from './parsePropsToQueryOptions';
import getProjection from './getProjection';
import isAdmin from './isAdmin';

const getQueryAndProjectionForRootAdmin = (publishName, props, getJSONDefs) => {
  // purposely not passing host as params, to check global roles
  if (!isAdmin(Meteor.userId(), 'admin')) throw new Error('No Authorization');

  const { fields, query } = getJSONDefs(publishName, props);

  const options = parsePropsToQueryOptions({ ...props, fields });
  if (options.search) query.$or = getJSONDefs(publishName, options).queryOr;

  const projection = getProjection(options);
  return { query, projection };
};

export default getQueryAndProjectionForRootAdmin;
