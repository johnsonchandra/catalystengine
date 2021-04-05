import { Meteor } from 'meteor/meteor';

import parseHost from '../parseHost';

const parseToOptions = (user, doc, parent) => {
  return {
    context: {
      headers: {
        origin: doc.host || parseHost(parent.connection.httpHeaders.host),
      },
      user: user || {
        _id: Meteor.settings.private.CRON_ID || 'vGxErho6sBZYQSwha',
        profile: {
          fullname: 'Cron',
        },
      },
    },
    args: doc,
  };
};

export default parseToOptions;
