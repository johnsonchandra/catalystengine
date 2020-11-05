export default (filename) =>
  `${filename
    .replace(/ /g, '_')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')}`;
// .replace(/[^a-z0-9_.]/g, '')}`;
