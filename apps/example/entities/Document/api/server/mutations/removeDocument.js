import checkOptionsArgsId from '../../../../../../common/helpers/checkOptionsArgsId';
import authorizer from '../../../../../../common/helpers/server/authorizer';

import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

import deleteDocument from '../processors/deleteDocument';

const publishName = 'removeDocument';
const removeDocument = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(
      options,
      publishName,
      getDocumentJSONdefs,
      checkOptionsArgsId,
    );
    const { args } = options;

    resolve(deleteDocument(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeDocument(options, resolve, reject);
  });
