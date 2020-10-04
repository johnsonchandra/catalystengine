import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Tenant from '../..';

import parseDocs from '../../../../../helpers/parseDocs';

// this methods for UI combo promise
Meteor.methods({
  getTenantListForEntry(search) {
    check(search, String);
    if (!Meteor.user()) throw new Error('You must be logged in...');

    const tenants = Tenant.find(
      {
        // status: { $ne: 'Draft' },
        status: 'Active',
      },
      { sort: { nr: 1 } },
    ).fetch();

    const options = parseDocs(tenants || [], [
      { from: '_id', to: 'value' },
      { from: (doc) => `${doc.nr}/${doc.type} - ${doc.name}`, to: 'label' },
    ]);

    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  },
});
