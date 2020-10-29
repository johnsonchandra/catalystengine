import Document from '../..';

import ownerQuery from '../../../../../../common/helpers/ownerQuery';
import entityRemove from '../../../../../../common/helpers/server/entityRemove';

const deleteDocument = (args, party, tenant) => {
  const query = {
    _id: args._id,
    status: 'Draft',
    ...ownerQuery(tenant.owner),
  };

  entityRemove(Document, query, 'Delete Document permanently', party);
  return args;
};

export default deleteDocument;
