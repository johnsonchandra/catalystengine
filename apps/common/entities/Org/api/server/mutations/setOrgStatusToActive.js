import Org from '../..';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import processOrgToActive from '../processors/processOrgToActive';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import authorizer from '../../../../../helpers/server/authorizer';

const publishName = 'setOrgStatusToActive';
const setOrgStatusToActive = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getOrgJSONdefs, checkOptionsArgsId);
    const { args } = options;

    const org = Org.findOne({
      _id: args._id,
    });
    if (!org) throw new Error(`[${publishName}] Org not found`);

    resolve(processOrgToActive(org, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setOrgStatusToActive(options, resolve, reject);
  });
