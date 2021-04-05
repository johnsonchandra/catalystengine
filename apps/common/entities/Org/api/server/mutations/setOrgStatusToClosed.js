import Org from '../..';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import processOrgToClosed from '../processors/processOrgToClosed';

import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import authorizer from '../../../../../helpers/server/authorizer';

const publishName = 'setOrgStatusToClosed';
const setOrgStatusToClosed = (options, resolve, reject) => {
  try {
    const { party, tenant } = authorizer(options, publishName, getOrgJSONdefs, checkOptionsArgsId);
    const { args } = options;

    const org = Org.findOne({
      _id: args._id,
    });
    if (!org) throw new Error(`[${publishName}] Org not found`);

    resolve(processOrgToClosed(org, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    setOrgStatusToClosed(options, resolve, reject);
  });
