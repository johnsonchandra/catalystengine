import UserLog from '../../entities/UserLog/api';

const entityUpdateWithoutHistories = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

  UserLog.insert({
    userId: party._id,
    condition: JSON.stringify(condition),
    doc: JSON.stringify(doc),
    description,
    timestamp,
    type: 'entityUpdateWithoutHistories',
  });

  return Entity.update(
    condition,
    {
      $set: {
        ...doc,
        updatedBy: party.name,
        updatedAt: timestamp,
      },
    },
    options,
  );
};

export default entityUpdateWithoutHistories;
