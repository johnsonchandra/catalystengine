import { Roles } from 'meteor/alanning:roles';

const isAdmin = (userId, scope) => Roles.userIsInRole(userId, 'admin', scope);
export default isAdmin;
