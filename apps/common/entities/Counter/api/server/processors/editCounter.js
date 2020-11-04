import sanitizeHtml from 'sanitize-html';

import Counter from '../..';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';

const editCounter = (args, counter, party) => {
  if (counter.status === 'Processing')
    throw new Error('Counter is in other process. Please wait and repeat');

  if (!(counter.status === 'Draft' || counter.status === 'Queue'))
    throw new Error(`Counter status: ${counter.status} cannot be edited anymore`);

  const newDoc = cleanseDocDiff(args, counter);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(Counter, { _id: counter._id }, newDoc, 'Updating Counter', party);

  return Counter.findOne(args._id);
};

export default editCounter;
