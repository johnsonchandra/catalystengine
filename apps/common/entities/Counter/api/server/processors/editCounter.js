import sanitizeHtml from 'sanitize-html';

import Counter from '../..';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';

const editCounter = (args, counter, party) => {
  if (counter.status === 'Processing')
    throw new Error('Counter is in other process. Please wait and repeat');

  if (!(counter.status === 'Draft' || counter.status === 'Queue'))
    throw new Error(`Counter status: ${counter.status} cannot be edited anymore`);

  // set to processing, this is to prevent race condition, since we havent used mongodb transaction yet
  entityUpdate(
    Counter,
    { _id: counter._id },
    {
      status: 'Processing',
    },
    'Processing editCounter',
    party,
  );

  const newDoc = cleanseDocDiff(args, counter);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;
  newDoc.status = counter.status;

  entityUpdate(
    Counter,
    { _id: counter._id },
    newDoc,
    `Counter updated, status back to ${counter.status}`,
    party,
  );

  return Counter.findOne(args._id);
};

export default editCounter;
