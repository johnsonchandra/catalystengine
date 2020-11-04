import getFileJSONdefs from '../../utils/getFileJSONdefs';

import authorizer from '../../../../../helpers/server/authorizer';

import createFile from '../processors/createFile';

const publishName = 'addFile';
const addFile = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getFileJSONdefs);
    const { args } = options;

    resolve(createFile(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    addFile(options, resolve, reject);
  });
