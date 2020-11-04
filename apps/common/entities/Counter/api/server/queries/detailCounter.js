import Counter from '../..';

import getProjection from '../../../../../helpers/getProjection';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getCounterJSONdefs from '../../utils/getCounterJSONdefs';
import authorizer from '../../../../../helpers/server/authorizer';
import getDocumentJSONdefs from '../../../../../../example/entities/Document/api/utils/getDocumentJSONdefs';
import parsePropsToQueryOptions from '../../../../../helpers/parsePropsToQueryOptions';

const action = (options, party, tenant) => {
  const { _id, publishName } = options;
  if (!_id) return undefined;

  const { fields, query } = getDocumentJSONdefs(publishName, options);
  const projection = getProjection(parsePropsToQueryOptions({ ...options, fields }));
  const selector = {
    ...query,
    ...ownerQuery(tenant.owner),
  };
  return Counter.findOne(selector, projection);
};

const detailCounter = (options, resolve, reject) => {
  const { publishName } = options;
  try {
    const { party, tenant } = authorizer(options, publishName, getCounterJSONdefs);
    resolve(action(options, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailCounter(options, resolve, reject);
  });
