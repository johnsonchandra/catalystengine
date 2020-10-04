const entityInsert = (Entity, doc, description, party, owner, now) => {
  const timestamp = now || new Date();

  // FIXME please write to log later on

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
