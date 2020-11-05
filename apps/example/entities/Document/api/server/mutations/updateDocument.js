import Document from '../..';

import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import authorizer from '../../../../../../common/helpers/server/authorizer';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

import editDocument from '../processors/editDocument';

const publishName = 'updateDocument';
const updateDocument = (options, resolve, reject) => {
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

    resolve(editDocument(args, document, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateDocument(options, resolve, reject);
  });
