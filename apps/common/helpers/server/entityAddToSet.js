const entityAddToSet = (Entity, condition, doc, description, party, now, options) => {
  const timestamp = now || new Date();

  // FIXME please write to log later on

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
