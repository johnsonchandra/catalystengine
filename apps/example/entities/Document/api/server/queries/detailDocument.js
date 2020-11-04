import Document from '../..';

import getProjection from '../../../../../../common/helpers/getProjection';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import parsePropsToQueryOptions from '../../../../../../common/helpers/parsePropsToQueryOptions';
import authorizer from '../../../../../../common/helpers/server/authorizer';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

const action = (options, party, tenant) => {
  const { _id, publishName } = options;
  if (!_id) return undefined;

  const { fields, query } = getDocumentJSONdefs(publishName, options);
  const projection = getProjection(parsePropsToQueryOptions({ ...options, fields }));
  const selector = {
    ...query,
    ...ownerQuery(tenant.owner),
  };
  return Document.findOne(selector, projection);
};

const detailDocument = (options, resolve, reject) => {
  const { publishName } = options;
  try {
    // toggle this if you want to enforce checking args._id
    // const { party, tenant } = authorizer(options, publishName, getDocumentJSONdefs, checkOptionsArgsId);
    const { party, tenant } = authorizer(options, publishName, getDocumentJSONdefs);

    resolve(action(options, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    detailDocument(options, resolve, reject);
  });
