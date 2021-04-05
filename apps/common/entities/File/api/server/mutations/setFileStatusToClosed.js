import File from '../..';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../helpers/ownerQuery';
import authorizer from '../../../../../helpers/server/authorizer';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

import processFileToClosed from '../processors/processFileToClosed';

const publishName = 'setFileStatusToClosed';
const setFileStatusToClosed = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getFileJSONdefs, checkOptionsArgsId);
    const { args } = options;

    const file = File.findOne({
      _id: args._id,
      ...ownerQuery(tenant.owner),
    });
    if (!file) throw new Error(`[${publishName}] File not found`);

    resolve(processFileToClosed(file, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setFileStatusToClosed(options, resolve, reject);
  });
