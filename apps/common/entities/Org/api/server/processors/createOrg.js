import { Meteor } from 'meteor/meteor';

import Org from '../..';

import entityInsert from '../../../../../helpers/server/entityInsert';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

const createOrg = (args, host, party) => {
  const now = new Date();

  const newDoc = {
    name: args.name,
    logoUrl: Meteor.settings.public.default.logoUrl,
    type: 'Company',
    status: 'Draft',
    hosts: {},
  };

  const hostDotToUnderscore = parseDotToUnderscore(host);
  newDoc.hosts[hostDotToUnderscore] = {
    status: 'Draft',
    createdAt: new Date(),
    createdBy: party.name,
  };

  const _id = entityInsert(Org, newDoc, 'Create new Org', party, undefined, now);

  return Org.findOne(_id);
};

export default createOrg;
