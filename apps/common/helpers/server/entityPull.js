import UserLog from '../../entities/UserLog/api';

const entityPull = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

  UserLog.insert({
    userId: party._id,
    condition: JSON.stringify(condition),
    doc: JSON.stringify(doc),
    description,
    timestamp,
    type: 'entityPull',
  });

  return Entity.update(
    condition,
    {
      $set: {
        updatedBy: party.name,
        updatedAt: timestamp,
      },
      $pull: doc,
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

export default entityPull;
