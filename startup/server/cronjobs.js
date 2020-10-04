import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

SyncedCron.add({
  name: '[ Common ] cron common',
  schedule(parser) {
    return parser.text('every 3 seconds');
  },
  job(intendedAt) {
    console.log(`[ Common ] cron common: ${intendedAt}`);
  },
});

SyncedCron.add({
  name: '[ Example ] cron example',
  schedule(parser) {
    return parser.text('every 5 seconds');
  },
  job(intendedAt) {
    console.log(`[ Example ] cron example: ${intendedAt}`);
  },
});

Meteor.startup(() => {
  SyncedCron.start();
});
