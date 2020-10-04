import addFile from './addFile';
import updateFile from './updateFile';
import removeFile from './removeFile';

import setFileStatusToActive from './setFileStatusToActive';
import setFileStatusToClosed from './setFileStatusToClosed';

export default {
  addFile: (root, args, context) =>
    addFile({
      context,
      args,
    }),
  updateFile: (root, args, context) =>
    updateFile({
      context,
      args: args.inputFile,
    }),
  removeFile: (root, args, context) =>
    removeFile({
      context,
      args,
    }),

  setFileStatusToActive: (root, args, context) =>
    setFileStatusToActive({
      context,
      args,
    }),
  setFileStatusToClosed: (root, args, context) =>
    setFileStatusToClosed({
      context,
      args,
    }),
};
