import File from '../..';

import getProjection from '../../../../../helpers/getProjection';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../helpers/ownerQuery';
import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';
import authorizer from '../../../../../helpers/server/authorizer';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const action = (publishName, args, tenant) => {
  const { fields } = getFileJSONdefs(publishName, args);
  const options = parsePropsToQueryOptions({ ...args, fields });

  const query = {
    ...getFileJSONdefs(publishName, args).query,
    ...ownerQuery(tenant.owner),
  };

  const projection = getProjection(options);

  return File.find(query, projection).fetch();
};

const listFile = (publishName, options, resolve, reject) => {
  try {
    const { tenant } = authorizer(options, publishName, getFileJSONdefs, checkOptionsArgsId);
    resolve(action(publishName, options, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default listFile;
