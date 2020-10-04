import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import File from '../../index';

import parseDocs from '../../../../../helpers/parseDocs';
import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import ownerQuery from '../../../../../helpers/ownerQuery';

// this methods for UI combo promise
Meteor.methods({
  getFileListForEntry(search) {
    check(search, String);
    if (!Meteor.user()) throw new Error('You must be logged in...');

    const host = parseHost(this.connection.httpHeaders.host);
    const tenant = getTenant(host);

    const files = File.find(
      {
        // status: { $ne: 'Draft' },
        status: 'Active',
        ...ownerQuery(tenant.owner),
      },
      { sort: { nr: 1 } },
    ).fetch();

    const options = parseDocs(files || [], [
      { from: '_id', to: 'value' },
      { from: (doc) => `${doc.nr}/${doc.type} - ${doc.name}`, to: 'label' },
    ]);

    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  },
});
