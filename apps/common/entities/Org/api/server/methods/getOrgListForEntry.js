import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Org from '../../index';

import parseDocs from '../../../../../helpers/parseDocs';
// import parseHost from '../../../../../modules/parseHost';
// import getTenant from '../../../../../modules/getTenant';
// import ownerQuery from '../../../../../modules/ownerQuery';

// this methods for UI combo promise
Meteor.methods({
  getOrgListForEntry(search) {
    check(search, String);
    if (!Meteor.user()) throw new Error('You must be logged in...');

    // const host = parseHost(this.connection.httpHeaders.host);
    // const tenant = getTenant(host);

    const orgs = Org.find(
      {
        status: 'Active',
        // ...ownerQuery(tenant.owner),
      },
      { sort: { nr: 1 } },
    ).fetch();

    const options = parseDocs(orgs || [], [
      { from: '_id', to: 'value' },
      { from: (doc) => `${doc.nr}/${doc.type} - ${doc.name}`, to: 'label' },
    ]);

    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  },
});
