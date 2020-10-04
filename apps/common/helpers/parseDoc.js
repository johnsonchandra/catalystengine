import _ from 'lodash';

export default (doc, mappings) => {
  const transformedDoc = {};
  if (!doc) return transformedDoc;

  mappings.forEach((mapping) => {
    transformedDoc[mapping.to] = _.isFunction(mapping.from)
      ? mapping.from(doc)
      : doc[mapping.from] || '';
  });
  return transformedDoc;
};
