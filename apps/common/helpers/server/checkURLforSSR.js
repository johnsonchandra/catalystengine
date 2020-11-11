import UrlPattern from 'url-pattern';

export default (inputURL) => {
  let isSSR = false;
  ['/Brand/:id', '/Product/:id', '/Trx/:id'].forEach((ssrURL) => {
    const pattern = new UrlPattern(ssrURL);
    isSSR = pattern.match(inputURL) || isSSR;
  });
  return isSSR;
};
