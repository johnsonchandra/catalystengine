import parseDotToUnderscore from './parseDotToUnderscore';

const getQueryHostExist = (host) => {
  const fieldHost = `hosts.${parseDotToUnderscore(host)}`;
  const queryOrgHost = {};
  queryOrgHost[fieldHost] = { $exists: true };
  return queryOrgHost;
};

export default getQueryHostExist;
