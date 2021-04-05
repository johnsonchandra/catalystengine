import File from '../..';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import ownerQuery from '../../../../../helpers/ownerQuery';
import authorizer from '../../../../../helpers/server/authorizer';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

import processFileToActive from '../processors/processFileToActive';

const publishName = 'setFileStatusToActive';
const setFileStatusToActive = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getFileJSONdefs, checkOptionsArgsId);
    const { args } = options;

    const file = File.findOne({
      _id: args._id,
      ...ownerQuery(tenant.owner),
    });
    if (!file) throw new Error(`[${publishName}] File not found`);

    resolve(processFileToActive(file, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setFileStatusToActive(options, resolve, reject);
  });
