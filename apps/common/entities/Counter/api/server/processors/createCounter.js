import Counter from '../..';

import entityInsert from '../../../../../helpers/server/entityInsert';

const createCounter = (args, party, tenant) => {
  const newDoc = {
    name: args.name,
    counter: 1,
    status: 'Draft',
  };

  const _id = entityInsert(Counter, newDoc, 'Create new Counter', party, tenant.owner);

  return Counter.findOne(_id);
};

export default createCounter;
