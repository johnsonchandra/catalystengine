import Document from '../..';

import entityInsert from '../../../../../../common/helpers/server/entityInsert';

const createDocument = (args, party, tenant) => {
  const now = new Date();

  const newDoc = {
    ...args,
    trxDate: now,
    type: 'Manual',
    status: 'Draft',
  };

  const _id = entityInsert(Document, newDoc, 'Create new Document', party, tenant.owner, now);

  return Document.findOne(_id);
};

export default createDocument;
