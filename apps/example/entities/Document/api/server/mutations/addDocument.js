import getDocumentJSONdefs from '../../utils/getDocumentJSONdefs';

import authorizer from '../../../../../../common/helpers/server/authorizer';
import createDocument from '../processors/createDocument';

const publishName = 'addDocument';
const addDocument = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getDocumentJSONdefs);
    const { args } = options;

    resolve(createDocument(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    addDocument(options, resolve, reject);
  });
