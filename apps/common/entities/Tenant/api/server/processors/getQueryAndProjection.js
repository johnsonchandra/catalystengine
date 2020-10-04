import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../../helpers/parseHost';
import checkAuth from '../../../../../helpers/checkAuth';
import getProjection from '../../../../../helpers/getProjection';

import getTenantJSONdefs from '../../utils/getTenantJSONdefs';

const getQueryAndProjection = (publishName, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getTenantJSONdefs(publishName);
  checkAuth(Meteor.user(), auth, host);

  const options = parsePropsToQueryOptions({ ...props, fields });

  const query = options.search
    ? {
        ...getTenantJSONdefs(publishName, props).query,
        $or: getTenantJSONdefs(publishName, options).queryOr,
      }
    : {
        ...getTenantJSONdefs(publishName, props).query,
      };

  const projection = getProjection(options);

  return { query, projection };
};

export default getQueryAndProjection;
