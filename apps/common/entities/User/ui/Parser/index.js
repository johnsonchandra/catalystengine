import parseDocs from '../../../../helpers/parseDocs';
import { iso, timeago } from '../../../../helpers/dates';
import parseHost from '../../../../helpers/parseHost';
import parseDotToUnderscore from '../../../../helpers/parseDotToUnderscore';

const UserParser = (docs, settings) => {
  return parseDocs(docs, [
    { from: '_id', to: '_id' },
    { from: (doc) => doc.profile && doc.profile.fullname, to: 'fullname' },
    {
      from: (doc) => {
        const email = doc.emails && doc.emails[0] && doc.emails[0].address;
        const verified =
          doc.emails && doc.emails[0] && doc.emails[0].verified ? '' : '[not verified]';
        return `${email}${verified}`;
      },
      to: 'email',
    },
    { from: (doc) => doc.profile && doc.profile.phone, to: 'phone' },
    {
      from: (doc) => {
        const status = doc.status && doc.status.online ? 'online' : 'offline';
        const idle = doc.status && doc.status.idle ? 'idle' : 'active';
        return `${status}${status === 'online' ? `/${idle}` : ''}`;
      },
      to: 'status',
    },
    {
      from: (doc) => {
        const host = parseDotToUnderscore(parseHost(window.location.hostname));
        const hostVisitLastTimestamp =
          doc.hosts &&
          doc.hosts[host] &&
          doc.hosts[host].visit &&
          doc.hosts[host].visit.last &&
          doc.hosts[host].visit.last.timestamp;
        return iso(hostVisitLastTimestamp, settings.timezone, 'LLLL');
      },
      to: 'hostLastLogin',
    },
    {
      from: (doc) => {
        const lastLogin = doc.status && doc.status.lastLogin && doc.status.lastLogin.date;
        return timeago(lastLogin, settings.timezone);
      },
      to: 'allLastLogin',
    },
    {
      from: (doc) => `/User/${doc._id}${doc.status === 'Draft' ? '/edit' : ''}`,
      to: 'linkUrl',
    },
  ]);
};

export default UserParser;
