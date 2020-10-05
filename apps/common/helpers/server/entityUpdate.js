import UserLog from '../../entities/UserLog/api';

const entityUpdate = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

  UserLog.insert({
    userId: party._id,
    condition,
    ...doc,
    description,
    timestamp,
    type: 'entityUpdate',
  });

  return Entity.update(
    condition,
    {
      $set: {
        ...doc,
        updatedBy: party.name,
        updatedAt: timestamp,
      },
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

export default entityUpdate;
