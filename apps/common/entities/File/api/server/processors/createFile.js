import File from '../..';

import entityInsert from '../../../../../helpers/server/entityInsert';

const createFile = (args, party, tenant) => {
  const newDoc = {
    ...args,
    type: 'File',
    status: 'Draft',
  };

  const _id = entityInsert(File, newDoc, 'Create new File', party, tenant.owner);

  return File.findOne(_id);
};

export default createFile;
