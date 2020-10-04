import addTenant from './addTenant';
import updateTenant from './updateTenant';
import removeTenant from './removeTenant';

import setTenantStatusToActive from './setTenantStatusToActive';
import setTenantStatusToClosed from './setTenantStatusToClosed';

export default {
  addTenant: (root, args, context) =>
    addTenant({
      context,
      args,
    }),
  updateTenant: (root, args, context) =>
    updateTenant({
      context,
      args: args.inputTenant,
    }),
  removeTenant: (root, args, context) =>
    removeTenant({
      context,
      args,
    }),

  setTenantStatusToActive: (root, args, context) =>
    setTenantStatusToActive({
      context,
      args,
    }),
  setTenantStatusToClosed: (root, args, context) =>
    setTenantStatusToClosed({
      context,
      args,
    }),
};
