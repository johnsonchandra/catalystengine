import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import parseHost from '../../../../../helpers/parseHost';
import checkAuth from '../../../../../helpers/checkAuth';
import getTenant from '../../../../../helpers/getTenant';
import ownerQuery from '../../../../../helpers/ownerQuery';
import getProjection from '../../../../../helpers/getProjection';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const getFileQueryAndProjection = (publishName, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getFileJSONdefs(publishName);
  checkAuth(Meteor.user(), auth, host);

  const options = parsePropsToQueryOptions({ ...props, fields });
  const tenant = getTenant(host);

  const query = options.search
    ? {
        ...getFileJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        $or: getFileJSONdefs(publishName, options).queryOr,
      }
    : {
        ...getFileJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        // level: 1, file, you can add something here
      };

  const projection = getProjection(options);

  return { query, projection };
};

export default getFileQueryAndProjection;
