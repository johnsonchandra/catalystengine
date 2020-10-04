const entityRemove = (Entity, condition, description, party, now) => {
  const timestamp = now || new Date();

  console.info(`[${timestamp}] [${party._id}: ${party.name}]: ${description}`);

  // FIXME please write to log later on

  return Entity.remove(condition);
};

export default entityRemove;
