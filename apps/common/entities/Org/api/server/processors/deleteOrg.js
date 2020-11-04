import Org from '../..';

import entityRemove from '../../../../../helpers/server/entityRemove';

const deleteOrg = (args, party) => {
  const query = {
    _id: args._id,
    status: 'Draft',
  };

  entityRemove(Org, query, 'Delete Org permanently', party);
  return args;
};

export default deleteOrg;
