import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Notification from '../../index';

import parseDocs from '../../../../../helpers/parseDocs';
import parseHost from '../../../../../helpers/parseHost';
import getTenant from '../../../../../helpers/getTenant';
import ownerQuery from '../../../../../helpers/ownerQuery';

// this methods for UI combo promise
Meteor.methods({
  getNotificationListForEntry(search) {
    check(search, String);
    if (!Meteor.user()) throw new Error('You must be logged in...');

    const host = parseHost(this.connection.httpHeaders.host);
    const tenant = getTenant(host);

    const notifications = Notification.find(
      {
        // status: { $ne: 'Draft' },
        status: 'Active',
        ...ownerQuery(tenant.owner),
      },
      { sort: { createdAt: 1 } },
    ).fetch();

    const options = parseDocs(notifications || [], [
      { from: '_id', to: 'value' },
      {
        from: (doc) =>
          `${doc.name} - from: ${doc.from && doc.from.name}, to: ${doc.to && doc.to.name}`,
        to: 'label',
      },
    ]);

    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  },
});
