import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import authorizer from '../../../../../helpers/server/authorizer';

import deleteFile from '../processors/deleteFile';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const publishName = 'removeFile';
const removeFile = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getFileJSONdefs, checkOptionsArgsId);
    const { args } = options;

    resolve(deleteFile(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeFile(options, resolve, reject);
  });
