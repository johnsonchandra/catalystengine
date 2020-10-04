import { Roles } from 'meteor/alanning:roles';

const processRoles = (_id, scopes, scope, name) => {
  const roles = scopes[name || scope]
    ? scopes[name || scope].map((scopeRole) => scopeRole.value)
    : [];
  Roles.setUserRoles(_id, roles, scope);
};

export default processRoles;
