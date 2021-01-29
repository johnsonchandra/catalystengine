import parseDocs from '../../../../../helpers/parseDocs';
import { iso, timeago } from '../../../../../helpers/dates';

const ProcessingParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: 'nr', to: 'nr' },
    { from: 'name', to: 'name' },
    {
      from: (doc) => doc.updatedAt && timeago(doc.updatedAt, settings.timezone),
      to: 'timeAgo',
    },
    { from: 'type', to: 'type' },
    { from: 'status', to: 'status' },
    { from: 'updatedBy', to: 'updatedBy' },
    {
      from: (doc) => doc.updatedAt && iso(doc.updatedAt, settings.timezone, 'LLLL'),
      to: 'updatedAt',
    },
    {
      from: (doc) => `/${doc.entityName}/${doc._id}`,
      to: 'linkUrl',
    },
  ]);
};

export default ProcessingParser;
