import { Meteor } from 'meteor/meteor';

import parsePropsToQueryOptions from '../../../../../../common/helpers/parsePropsToQueryOptions';
import parseHost from '../../../../../../common/helpers/parseHost';
import checkAuth from '../../../../../../common/helpers/checkAuth';
import getTenant from '../../../../../../common/helpers/getTenant';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import getProjection from '../../../../../../common/helpers/getProjection';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const getDocumentQueryAndProjection = (publishName, props, parent) => {
  const host = parseHost(parent.connection.httpHeaders.host);
  const { fields, auth } = getDocumentJSONdefs(publishName);
  checkAuth(Meteor.user(), auth, host);

  const options = parsePropsToQueryOptions({ ...props, fields });
  const tenant = getTenant(host);

  const query = options.search
    ? {
        ...getDocumentJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        $or: getDocumentJSONdefs(publishName, options).queryOr,
      }
    : {
        ...getDocumentJSONdefs(publishName, props).query,
        ...ownerQuery(tenant.owner),
        // level: 1, document, you can add something here
      };

  const projection = getProjection(options);

  return { query, projection };
};

export default getDocumentQueryAndProjection;
