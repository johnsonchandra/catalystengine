import parseDocs from '../../../../helpers/parseDocs';
import { iso } from '../../../../helpers/dates';

const FileParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: 'name', to: 'name' },
    { from: 'fsUrl', to: 'fsUrl' },
    { from: 'localUrl', to: 'localUrl' },
    { from: 'cloudUrl', to: 'cloudUrl' },
    { from: 'size', to: 'size' },
    { from: 'mimeType', to: 'mimeType' },
    { from: 'type', to: 'type' },
    { from: 'status', to: 'status' },
    {
      from: (doc) => doc.updatedAt && iso(doc.updatedAt, settings.timezone, 'LLLL'),
      to: 'updatedAt',
    },
    {
      from: (doc) => `/File/${doc._id}${doc.status === 'Draft' ? '/edit' : ''}`,
      to: 'linkUrl',
    },
  ]);
};

export default FileParser;
