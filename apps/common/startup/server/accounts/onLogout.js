// // import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
// // import { Roles } from 'meteor/alanning:roles';
// //
// // import Tenant from '../../../entities/Tenant/api';
// //
// // import parseHost from '../../../modules/parseHost';
// // import parseDotToUnderscore from '../../../modules/parseDotToUnderscore';
//
// // TODO coba lihat apa yg terjadi bila login dari mobile hehehe
// Accounts.onLogout((options) => {
//   console.info('options in onLogout', options);
//
//   // FIXME catet onLogout di log
//
//   // const host = parseHost(options.connection.httpHeaders.host);
//   // const tenant = Tenant.findOne({ host });
//   //
//   // // just add without checking first, because checking first add more steps
//   // Roles.addUsersToRoles(options.user._id, tenant.roleStandard, host);
//   //
//   // const timestamp = new Date();
//   //
//   // const modifier = {
//   //   $push: {
//   //     lastLogins: {
//   //       host,
//   //       timestamp,
//   //       clientAddress: options.connection.clientAddress,
//   //       httpHeaders: options.connection.httpHeaders,
//   //     },
//   //   },
//   // };
//   //
//   // const hostDotToUnderscore = parseDotToUnderscore(host);
//   //
//   // modifier.$set = {};
//   // modifier.$set[`hosts.${hostDotToUnderscore}.lastLogin`] = {
//   //   clientAddress: options.connection.clientAddress,
//   //   httpHeaders: options.connection.httpHeaders,
//   //   timestamp,
//   // };
//   //
//   // const selector = { _id: options.user._id };
//   // selector[`hosts.${hostDotToUnderscore}`] = { $exists: true };
//   //
//   // const userHasBeenInHost = Meteor.users.findOne(selector);
//   // if (!userHasBeenInHost) {
//   //   modifier.$set[`hosts.${hostDotToUnderscore}.firstvisit`] = {
//   //     clientAddress: options.connection.clientAddress,
//   //     httpHeaders: options.connection.httpHeaders,
//   //     timestamp,
//   //   };
//   // }
//   //
//   // Meteor.users.update({ _id: options.user._id }, modifier);
// });
