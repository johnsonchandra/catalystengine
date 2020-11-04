import getDocumentJSONdefs from '../../../../../../example/entities/Document/api/utils/getDocumentJSONdefs';

import authorizer from '../../../../../helpers/server/authorizer';

import createCounter from '../processors/createCounter';

const publishName = 'addCounter';
const addCounter = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getDocumentJSONdefs);
    const { args } = options;

    resolve(createCounter(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    addCounter(options, resolve, reject);
  });
