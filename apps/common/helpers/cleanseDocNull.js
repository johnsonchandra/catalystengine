export default (docInput) => {
  const docClean = {};
  Object.keys(docInput).forEach((key) => {
    if (docInput[key]) {
      docClean[key] = docInput[key];
    }
  });
  return docClean;
};
