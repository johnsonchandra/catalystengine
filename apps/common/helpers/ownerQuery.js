const ownerQuery = (owner) => {
  return {
    'owner._id': owner._id,
    'owner.type': owner.type,
  };
};

export default ownerQuery;
