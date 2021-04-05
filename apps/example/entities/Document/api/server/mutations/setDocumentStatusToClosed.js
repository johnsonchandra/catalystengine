import Document from '../..';

import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import authorizer from '../../../../../../common/helpers/server/authorizer';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

import processDocumentToClosed from '../processors/processDocumentToClosed';

const publishName = 'setDocumentStatusToClosed';
const setDocumentStatusToClosed = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(
      options,
      publishName,
      getDocumentJSONdefs,
      checkOptionsArgsId,
    );
    const { args } = options;

    const document = Document.findOne({
      _id: args._id,
      ...ownerQuery(tenant.owner),
    });
    if (!document) throw new Error(`[${publishName}] Document not found`);

    resolve(processDocumentToClosed(document, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setDocumentStatusToClosed(options, resolve, reject);
  });
