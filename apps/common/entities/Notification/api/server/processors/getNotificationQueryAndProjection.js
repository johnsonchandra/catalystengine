import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../../helpers/parseHost';
import checkAuth from '../../../../../helpers/checkAuth';
import getTenant from '../../../../../helpers/getTenant';
import ownerQuery from '../../../../../helpers/ownerQuery';
import getProjection from '../../../../../helpers/getProjection';

import getNotificationJSONdefs from '../../utils/getNotificationJSONdefs';

const getNotificationQueryAndProjection = (publishName, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getNotificationJSONdefs(publishName);
  checkAuth(Meteor.user(), auth, host);

  const options = parsePropsToQueryOptions({ ...props, fields });
  const tenant = getTenant(host);

  const query = options.search
    ? {
        ...getNotificationJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        $or: getNotificationJSONdefs(publishName, options).queryOr,
      }
    : {
        ...getNotificationJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        // level: 1, notification, you can add something here
      };

  const projection = getProjection(options);

  return { query, projection };
};

export default getNotificationQueryAndProjection;
