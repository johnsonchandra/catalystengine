import { Roles } from 'meteor/alanning:roles';

const parseUserRoles = (userId, roles, scope, scopeName) =>
  roles.map((role) => ({
    name: scopeName || scope || 'ROOT',
    value: role,
    defaultChecked: Roles.userIsInRole(userId, role, scope),
  })) || [];

export default parseUserRoles;
