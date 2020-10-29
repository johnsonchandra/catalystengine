import { Counts } from 'meteor/tmeasday:publish-counts';

import getQueryAndProjection from './getQueryAndProjection';

const pubProcessor = (Entity, publishName, getJSONdefs, props, parent) => {
  const { query, projection } = getQueryAndProjection(publishName, getJSONdefs, props, parent);

  Counts.publish(parent, `${publishName}Count`, Entity.find(query));
  return Entity.find(query, projection);
};

export default pubProcessor;
