import React from 'react';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'isomorphic-fetch';
import { onPageLoad } from 'meteor/server-render';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import { Meteor } from 'meteor/meteor';

// import checkIfBlacklisted from '../../helpers/server/checkIfBlacklisted';
import checkURLforSSR from '../../helpers/server/checkURLforSSR';
import parseHost from '../../helpers/parseHost';

import Tenant from '../../entities/Tenant/api';

import CommonApp from '../../ui/layout';
import ExampleApp from '../../../example/ui/layout';

const Apps = {
  'common.maya': CommonApp,
  'example.maya': ExampleApp,
  localhost: ExampleApp,
};

onPageLoad(async (sink) => {
  if (!checkURLforSSR(sink.request.url.path)) {
    sink.appendToBody(`
      <script>
        window.noSSR = true;
      </script>
    `);
    return;
  }

  const host = parseHost(sink.request.headers.host);
  const App = Apps[host];

  const tenant = Tenant.findOne({ host });

  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: Meteor.settings.public.graphQL.httpUri,
      headers: {
        origin: sink.request.headers.host,
      },
    }),
    cache: new InMemoryCache(),
  });

  const stylesheet = new ServerStyleSheet();
  const app = stylesheet.collectStyles(
    <ApolloProvider client={apolloClient}>
      <StaticRouter location={sink.request.url} context={{}}>
        <App settings={tenant && tenant.settings} />
      </StaticRouter>
    </ApolloProvider>,
  );

  // NOTE: renderToStringWithData pre-fetches all queries in the component tree. This allows the data
  // from our GraphQL queries to be ready at render time.
  const content = await renderToStringWithData(app);
  const initialState = apolloClient.extract();
  const helmet = Helmet.renderStatic();

  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());
  sink.appendToHead(stylesheet.getStyleTags());
  sink.renderIntoElementById('react-root', content);
  sink.appendToBody(`
    <script>
      window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
    </script>
  `);
});
