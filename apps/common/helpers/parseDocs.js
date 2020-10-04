import parseDoc from './parseDoc';

export default (docs, mappings) => {
  const parsedDocs = [];
  if (!docs) return parsedDocs;
  docs.forEach((doc) => {
    parsedDocs.push(parseDoc(doc, mappings));
  });
  return parsedDocs;
};
