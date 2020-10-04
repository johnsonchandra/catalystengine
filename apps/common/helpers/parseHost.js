import { Meteor } from 'meteor/meteor';

export default (url) => {
  if (Meteor.settings.public.hostForce && Meteor.settings.public.hostForce !== '') {
    return Meteor.settings.public.hostForce;
  }
  let hostname = url.split('/');
  hostname = url.indexOf('//') > -1 ? hostname[2] : hostname[0];
  [hostname] = hostname.split(':');
  [hostname] = hostname.split('?');
  return hostname;
};
