import Counter from '../../entities/Counter/api';

import entityInsert from './entityInsert';
import ownerQuery from '../ownerQuery';

const getCounter = (name, type, party, owner) => {
  let counter = Counter.findOne({
    name,
    type,
    ...ownerQuery(owner),
  });
  if (!counter) {
    counter = {
      name,
      type,
      counter: 1,
    };
    counter._id = entityInsert(
      Counter,
      counter,
      `create new Counter with name: ${name} type: ${type}`,
      party,
      owner,
    );
  }

  Counter.update({ _id: counter._id }, { $inc: { counter: 1 } });

  return counter;
};

export default getCounter;
