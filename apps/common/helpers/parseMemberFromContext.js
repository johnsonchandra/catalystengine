export default (context) => {
  return {
    _id: context.user._id,
    type: 'Member',
    name: context.user.profile.fullname,
  };
};
