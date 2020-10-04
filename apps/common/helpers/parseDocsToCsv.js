import _ from 'lodash';

export default (docs) => {
  // convert JSON to CSV
  const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(docs[0]);
  _.pullAll(header, ['_id', 'style', 'linkUrl']);
  let csv = docs.map((row) =>
    header
      .map((fieldName) => {
        const fieldValue =
          row[fieldName] && row[fieldName].value ? row[fieldName].value : row[fieldName];
        return JSON.stringify(fieldValue, replacer);
      })
      .join(','),
  );
  csv.unshift(header.join(','));
  csv = csv.join('\r\n');
  return csv;
};
