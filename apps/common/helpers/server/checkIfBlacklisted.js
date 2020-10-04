import UrlPattern from 'url-pattern';

export default (url) => {
  let isBlacklisted = true;
  ['/Document/:id'].forEach((blacklistedPattern) => {
    const pattern = new UrlPattern(blacklistedPattern);
    isBlacklisted = !pattern.match(url);
  });
  return isBlacklisted;
};
