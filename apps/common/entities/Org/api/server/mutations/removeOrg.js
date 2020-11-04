import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import authorizer from '../../../../../helpers/server/authorizer';

import deleteOrg from '../processors/deleteOrg';

const publishName = 'removeOrg';
const removeOrg = (options, resolve, reject) => {
  try {
    const { party } = authorizer(options, publishName, getOrgJSONdefs);
    const { args } = options;

    resolve(deleteOrg(args, party));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    removeOrg(options, resolve, reject);
  });
