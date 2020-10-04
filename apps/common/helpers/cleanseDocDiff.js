import _ from 'lodash';

export default (docToBeCleaned, docInput) => {
  if (!docInput) return docToBeCleaned;

  const docCleaned = {};
  Object.keys(docToBeCleaned).forEach((key) => {
    // FIXME array is not yet tested
    if (!_.isEqual(docInput[key], docToBeCleaned[key])) {
      docCleaned[key] = docToBeCleaned[key];
    }
  });
  return docCleaned;
};
