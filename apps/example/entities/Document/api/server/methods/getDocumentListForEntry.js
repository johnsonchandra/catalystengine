import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Document from '../../index';

import parseDocs from '../../../../../../common/helpers/parseDocs';
import parseHost from '../../../../../../common/helpers/parseHost';
import getTenant from '../../../../../../common/helpers/getTenant';
import ownerQuery from '../../../../../../common/helpers/ownerQuery';

// this methods for UI combo promise
Meteor.methods({
  getDocumentListForEntry(search) {
    check(search, String);
    if (!Meteor.user()) throw new Error('You must be logged in...');

    const host = parseHost(this.connection.httpHeaders.host);
    const tenant = getTenant(host);

    const documents = Document.find(
      {
        // status: { $ne: 'Draft' },
        status: 'Active',
        ...ownerQuery(tenant.owner),
      },
      { sort: { nr: 1 } },
    ).fetch();

    const options = parseDocs(documents || [], [
      { from: '_id', to: 'value' },
      { from: (doc) => `${doc.nr}/${doc.type} - ${doc.name}`, to: 'label' },
    ]);

    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  },
});
