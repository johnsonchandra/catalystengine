import UserLog from '../../entities/UserLog/api';

const entityRemove = (Entity, condition, description, party, now) => {
  const timestamp = now || new Date();

  console.info(`[${timestamp}] [${party._id}: ${party.name}]: ${description}`);

  UserLog.insert({
    userId: party._id,
    condition: JSON.stringify(condition),
    description,
    timestamp,
    type: 'entityRemove',
  });

  return Entity.remove(condition);
};

export default entityRemove;
