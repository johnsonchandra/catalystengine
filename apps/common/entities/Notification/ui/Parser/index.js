import parseDocs from '../../../../helpers/parseDocs';
import { iso } from '../../../../helpers/dates';

const NotificationParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: 'name', to: 'name' },
    {
      from: (doc) => doc.from && doc.from.name,
      to: 'from',
    },
    {
      from: (doc) => doc.to && doc.to.name,
      to: 'to',
    },
    { from: 'description', to: 'description' },
    { from: 'type', to: 'type' },
    { from: 'status', to: 'status' },
    {
      from: (doc) => doc.updatedAt && iso(doc.updatedAt, settings.timezone, 'LLLL'),
      to: 'updatedAt',
    },
    {
      from: (doc) => `/Notification/${doc._id}${doc.status === 'Draft' ? '/edit' : ''}`,
      to: 'linkUrl',
    },
  ]);
};

export default NotificationParser;
