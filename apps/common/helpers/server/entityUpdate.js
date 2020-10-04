const entityUpdate = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

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
