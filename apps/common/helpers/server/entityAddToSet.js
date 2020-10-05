import UserLog from '../../entities/UserLog/api';

const entityAddToSet = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

  UserLog.insert({
    userId: party._id,
    condition: JSON.stringify(condition),
    doc: JSON.stringify(doc),
    options,
    description,
    timestamp,
    type: 'entityAddToSet',
  });

  return Entity.update(
    condition,
    {
      $set: {
        updatedBy: party.name,
        updatedAt: timestamp,
      },
      $addToSet: doc,
      $push: {
        histories: {
          party,
          timestamp,
          doc: JSON.stringify(doc),
          description,
        },
      },
    },
    options,
  );
};

export default entityAddToSet;
