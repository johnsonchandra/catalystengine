/* eslint-disable no-underscore-dangle, no-unused-expressions */

import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import apolloClient from '../../apps/common/startup/client/apollo';

import AppImporter from './AppImporter';

Bert.defaults.style = 'growl-bottom-right';

Accounts.onLogout(() => apolloClient.resetStore());

Meteor.startup(() => {
  const target = document.getElementById('react-root');
  const app = (
    <ThemeProvider theme={{}}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <Switch>
            <AppImporter />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>
  );

  return !window.noSSR ? hydrate(app, target) : render(app, target);
});
