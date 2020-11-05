import sanitizeHtml from 'sanitize-html';

import File from '../..';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseStringToArray from '../../../../../helpers/parseStringToArray';

const editFile = (args, file, party) => {
  if (file.status === 'Processing')
    throw new Error('File is in other process. Please wait and repeat');

  if (!(file.status === 'Draft' || file.status === 'Queue'))
    throw new Error(`File status: ${file.status} cannot be edited anymore`);

  // eslint-disable-next-line no-param-reassign
  if (args.tags) args.tags = parseStringToArray(args.tags);

  const newDoc = cleanseDocDiff(args, file);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(File, { _id: file._id }, newDoc, 'Updating File', party);

  return File.findOne(args._id);
};

export default editFile;
