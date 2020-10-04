import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../../helpers/parseHost';
import checkAuth from '../../../../../helpers/checkAuth';
import getTenant from '../../../../../helpers/getTenant';
import ownerQuery from '../../../../../helpers/ownerQuery';
import getProjection from '../../../../../helpers/getProjection';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';

const getCounterQueryAndProjection = (publishName, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getCounterJSONdefs(publishName);
  checkAuth(Meteor.user(), auth, host);

  const options = parsePropsToQueryOptions({ ...props, fields });
  const tenant = getTenant(host);

  const query = options.search
    ? {
        ...getCounterJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        $or: getCounterJSONdefs(publishName, options).queryOr,
      }
    : {
        ...getCounterJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
      };

  const projection = getProjection(options);

  return { query, projection };
};

export default getCounterQueryAndProjection;
