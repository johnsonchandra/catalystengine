/* eslint-disable no-underscore-dangle */

import { Meteor } from 'meteor/meteor';
import { MeteorAccountsLink } from 'meteor/apollo';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, location, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const queryOrMutationLink = () =>
  // NOTE: createPersistedQueryLink ensures that queries are cached if they have not
  // changed (reducing unnecessary load on the client).
  new HttpLink({
    uri: Meteor.settings.public.graphQL.httpUri,
    credentials: 'same-origin',
  });

const apolloClient = new ApolloClient({
  connectToDevTools: Meteor.isDevelopment,
  link: ApolloLink.from([MeteorAccountsLink(), errorLink, queryOrMutationLink()]),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

export default apolloClient;
