import addCounter from './addCounter';
import updateCounter from './updateCounter';
import removeCounter from './removeCounter';

import setCounterStatusToActive from './setCounterStatusToActive';
import setCounterStatusToClosed from './setCounterStatusToClosed';

export default {
  addCounter: (root, args, context) =>
    addCounter({
      context,
      args,
    }),
  updateCounter: (root, args, context) =>
    updateCounter({
      context,
      args: args.inputCounter,
    }),
  removeCounter: (root, args, context) =>
    removeCounter({
      context,
      args,
    }),

  setCounterStatusToActive: (root, args, context) =>
    setCounterStatusToActive({
      context,
      args,
    }),
  setCounterStatusToClosed: (root, args, context) =>
    setCounterStatusToClosed({
      context,
      args,
    }),
};
