import parseDocs from '../../../../../common/helpers/parseDocs';
import { iso } from '../../../../../common/helpers/dates';

const DocumentParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: 'nr', to: 'nr' },
    { from: 'name', to: 'name' },
    {
      from: (doc) =>
        doc.amount &&
        doc.amount.toLocaleString('id', {
          style: 'currency',
          currency: doc.currency || settings.currency || 'IDR',
          maximumFractionDigits: settings.maximumFractionDigits,
          minimumFractionDigits: settings.minimumFractionDigits,
        }),
      to: 'Amount',
    },
    {
      from: (doc) => doc.trxDate && iso(doc.trxDate, settings.timezone, 'LLLL'),
      to: 'trxDate',
    },
    { from: 'type', to: 'type' },
    { from: 'status', to: 'status' },
    {
      from: (doc) => doc.updatedAt && iso(doc.updatedAt, settings.timezone, 'LLLL'),
      to: 'updatedAt',
    },
    {
      from: (doc) => `/Document/${doc._id}${doc.status === 'Draft' ? '/edit' : ''}`,
      to: 'linkUrl',
    },
  ]);
};

export default DocumentParser;
