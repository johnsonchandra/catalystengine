import Counter from '../../entities/Counter/api';

import entityInsert from './entityInsert';

const getCounter = (type, party, owner) => {
  let counter = Counter.findOne({
    type,
    'owner._id': owner._id,
    'owner.type': owner.type,
  });
  if (!counter) {
    counter = {
      type,
      counter: 1,
    };
    counter._id = entityInsert(Counter, counter, 'create new Counter', party, owner);
  }

  Counter.update({ _id: counter._id }, { $inc: { counter: 1 } });

  return counter.counter;
};

export default getCounter;
