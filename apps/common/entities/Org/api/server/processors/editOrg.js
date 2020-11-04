import sanitizeHtml from 'sanitize-html';

import Org from '../..';

import cleanseDocDiff from '../../../../../helpers/cleanseDocDiff';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

const editOrg = (args, org, party, host) => {
  if (org.status === 'Processing')
    throw new Error('Org is in other process. Please wait and repeat');

  if (!(org.status === 'Draft' || org.status === 'Queue'))
    throw new Error(`Org status: ${org.status} cannot be edited anymore`);

  const newDoc = cleanseDocDiff(args, org);
  newDoc.description = newDoc.description ? sanitizeHtml(newDoc.description) : newDoc.description;

  const hostDotToUnderscore = parseDotToUnderscore(host);

  if (!(org.hosts && org.hosts[hostDotToUnderscore])) {
    newDoc[`hosts.${hostDotToUnderscore}`] = {
      status: 'Draft',
      createdAt: new Date(),
      createdBy: party.name,
    };
  }

  entityUpdate(Org, { _id: org._id }, newDoc, 'Updating Org', party);
  return Org.findOne(args._id);
};

export default editOrg;
