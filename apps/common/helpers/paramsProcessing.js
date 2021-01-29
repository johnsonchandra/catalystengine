import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

const paramsProcessing = (Entities, options) => {
  const subscriptions = Entities.map((entity) =>
    Meteor.subscribe(`list${entity.name}Processing`, options),
  );

  let loading = true;
  subscriptions.forEach((subscription, index) => {
    loading = index === 0 ? !subscription.ready() : loading || !subscription.ready();
  });

  let docs = [];
  Entities.forEach((entity) => {
    const entityDocs = entity.Entity.find(
      { status: 'Processing' },
      {
        sort: options.sort,
      },
    )
      .fetch()
      .map((entityDoc) => {
        return {
          entityName: entity.name,
          ...entityDoc,
        };
      });
    docs = docs.concat(entityDocs);
  });

  let total = 0;
  const totals = Entities.map((entity) => {
    const entityTotal = Counts.get(`list${entity.name}ProcessingCount`);
    total += entityTotal;
    return {
      entityName: entity.name,
      total: entityTotal,
    };
  });

  return {
    loading,
    docs,
    totals,
    total,
  };
};
export default paramsProcessing;
