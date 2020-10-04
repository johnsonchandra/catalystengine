import parseDocs from '../../../../helpers/parseDocs';
import { iso } from '../../../../helpers/dates';

const OrgParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: 'name', to: 'name' },
    { from: 'phone', to: 'phone' },
    { from: 'nr', to: 'nr' },
    { from: 'type', to: 'type' },
    { from: 'status', to: 'status' },
    {
      from: (doc) => doc.updatedAt && iso(doc.updatedAt, settings.timezone, 'LLLL'),
      to: 'Updated At',
    },
    {
      from: (doc) => `/Org/${doc._id}${doc.status === 'Draft' ? '/edit' : ''}`,
      to: 'linkUrl',
    },
  ]);
};

export default OrgParser;
