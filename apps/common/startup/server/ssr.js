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
  const host = parseHost(sink.request.headers.host);

  const tenant = Tenant.findOne({ host });
  if (!tenant) throw new Error('Tenant not found in sink');

  // FIXME make softcode based on tenant
  sink.appendToHead(`<title>${tenant.settings.fullname}</title>`);
  sink.appendToHead(`<meta name="description" content="${tenant.settings.description}">`);
  sink.appendToHead(
    `<meta name="viewport" content="initial-scale=1, minimal-ui, maximum-scale=5, minimum-scale=1"/>`,
  );
  sink.appendToHead(`<meta name="theme-color" content="#4285F4"/>`);
  sink.appendToHead(
    `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">`,
  );
  sink.appendToHead(`<link rel="shortcut icon" href="${tenant.settings.logo || '/mkcb.ico'}">`);
  sink.appendToHead(
    `<link rel="apple-touch-icon" sizes="120x120" href="${tenant.settings.logo ||
      '/mkcb_logo.png'}/">`,
  );
  sink.appendToHead(`<link rel="apple-touch-icon" sizes="120x120" href="/mkcb_logo.png">`);
  // sink.appendToHead(`<link rel="manifest" href="/manifest.json">`);

  if (!checkURLforSSR(sink.request.url.path)) {
    sink.appendToBody(`
      <script>
        window.noSSR = true;
      </script>
    `);
    return;
  }

  const App = Apps[host];

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
        <App host={host} settings={tenant && tenant.settings} />
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
