import moment from 'moment';
import 'moment-timezone';

// monthDayYear 'MMMM Do, YYYY'
// monthDayYearAtTime 'MMMM Do, YYYY [at] hh:mm a'

const parseTimestamp = (timestamp) => {
  const timestampInt = parseInt(timestamp, 10);
  return isNaN(timestampInt) ? timestamp : timestampInt;
};

export const timeago = (timestamp, timezone) => {
  if (timestamp)
    return !timezone
      ? moment(parseTimestamp(timestamp)).fromNow()
      : moment(parseTimestamp(timestamp))
          .tz(timezone)
          .fromNow();
  return 'Never';
};

export const add = (timestamp, amount, range, timezone) =>
  !timezone
    ? moment(timestamp)
        .add(amount, range)
        .format()
    : moment(timestamp)
        .tz(timezone)
        .add(amount, range)
        .format();

export const year = (timestamp, timezone) =>
  !timezone
    ? moment(timestamp).format('YYYY')
    : moment(timestamp)
        .tz(timezone)
        .format('YYYY');

export const iso = (timestamp, timezone, format) => {
  if (timestamp)
    return !timezone
      ? moment(parseTimestamp(timestamp)).format(format)
      : moment(parseTimestamp(timestamp))
          .tz(timezone)
          .format(format);
  return 'Never';
};

export const processIntYYYYMMDDtoDate = (angka) => {
  const stringAngka = angka.toString();
  return new Date(
    `${stringAngka.substring(6)}/${stringAngka.substring(4, 6)}/${stringAngka.substring(0, 4)}`,
  );
};
