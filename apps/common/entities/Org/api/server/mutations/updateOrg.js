import Org from '../..';

import getOrgJSONdefs from '../../utils/getOrgJSONdefs';

import editOrg from '../processors/editOrg';

import authorizer from '../../../../../helpers/server/authorizer';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';

const publishName = 'updateOrg';
const updateOrg = (options, resolve, reject) => {
  try {
    const { party, host } = authorizer(options, publishName, getOrgJSONdefs, checkOptionsArgsId);
    const { args } = options;

    const org = Org.findOne({
      _id: args._id,
    });
    if (!org) throw new Error(`[${publishName}] Org not found`);

    resolve(editOrg(args, org, party, host));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateOrg(options, resolve, reject);
  });
