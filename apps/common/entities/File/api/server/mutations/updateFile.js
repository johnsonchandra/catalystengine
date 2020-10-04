import sanitizeHtml from 'sanitize-html';

import File from '../../index';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import getTenant from '../../../../../helpers/getTenant';
import checkOptions from '../../../../../helpers/checkOptions';
import checkOptionsArgsId from '../../../../../helpers/checkOptionsArgsId';
import checkAuth from '../../../../../helpers/checkAuth';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import ownerQuery from '../../../../../helpers/ownerQuery';

import getFileJSONdefs from '../../utils/getFileJSONdefs';

const publishName = 'updateFile';
const action = (args, party, tenant) => {
  const file = File.findOne({
    _id: args._id,
    ...ownerQuery(tenant.owner),
  });
  if (!file) throw new Error(`[${publishName}] File not found`);
  if (!(file.status === 'Draft' || file.status === 'Queue'))
    throw new Error(`[${publishName}] File cannot be edited anymore`);
  if (file.status === 'Processing')
    throw new Error(`[${publishName}] File is in other process. Please wait and repeat`);

  // eslint-disable-next-line no-param-reassign
  if (args.trxDate) args.trxDate = new Date(args.trxDate);

  // const { fromDate, thruDate, maxForward, maximumFractionDigits } = tenant.settings;

  // eslint-disable-next-line no-param-reassign
  // args.amount = +args.amount.toFixed(maximumFractionDigits);

  const newDoc = cleanseDocDiff(args, file);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  entityUpdate(File, { _id: file._id }, newDoc, 'Updating File', party);

  // file if you want to update other related entities
  // entityUpdate(
  //   AccountMovement,
  //   { FileId: newFile._id },
  //   {
  //     file: {
  //       nr: newFile.nr,
  //       name: newFile.name,
  //     },
  //   },
  //   'Update AccountMovement cause File updated',
  //   party,
  //   newFile.updatedAt,
  //   { multi: true },
  // );

  return File.findOne(args._id);
};

const updateFile = (options, resolve, reject) => {
  try {
    checkOptions(options, checkOptionsArgsId);

    const { args, context } = options;
    const host = parseHost(context.headers.origin);
    const roles = getFileJSONdefs(publishName).auth;

    checkAuth(context.user, roles, host);

    const party = parseMemberFromContext(context);
    const tenant = getTenant(host);

    resolve(action(args, party, tenant));
  } catch (exception) {
    reject(`[${publishName}] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateFile(options, resolve, reject);
  });
