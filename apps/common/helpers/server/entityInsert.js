import UserLog from '../../entities/UserLog/api';

const entityInsert = (Entity, doc, description, party, owner, now) => {
  const timestamp = now || new Date();

  UserLog.insert({
    userId: party._id,
    doc: JSON.stringify(doc),
    owner,
    description,
    timestamp,
    type: 'entityInsert',
  });

  return Entity.insert({
    ...doc,
    owner,
    createdBy: party.name,
    createdAt: timestamp,
    updatedBy: party.name,
    updatedAt: timestamp,
    histories: [
      {
        party: {
          _id: party._id,
          name: party.name,
          type: 'Member',
        },
        timestamp,
        doc: JSON.stringify(doc),
        description,
      },
    ],
  });
};

export default entityInsert;
