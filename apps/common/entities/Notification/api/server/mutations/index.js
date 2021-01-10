import addNotification from './addNotification';
import updateNotification from './updateNotification';
import removeNotification from './removeNotification';

import setNotificationStatusToActive from './setNotificationStatusToActive';
import setNotificationStatusToClosed from './setNotificationStatusToClosed';

export default {
  addNotification: (root, args, context) =>
    addNotification({
      context,
      args,
    }),
  updateNotification: (root, args, context) =>
    updateNotification({
      context,
      args: args.inputNotification,
    }),
  removeNotification: (root, args, context) =>
    removeNotification({
      context,
      args,
    }),

  setNotificationStatusToActive: (root, args, context) =>
    setNotificationStatusToActive({
      context,
      args,
    }),
  setNotificationStatusToClosed: (root, args, context) =>
    setNotificationStatusToClosed({
      context,
      args,
    }),
};
