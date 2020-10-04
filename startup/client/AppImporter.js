import React from 'react';
import Loadable from 'react-loadable';

import Loading from '../../apps/common/ui/components/Loading';
import parseHost from '../../apps/common/helpers/parseHost';

// toogle this if you do not want dynamic loading, e.g. for debug purpose
// import App from '../../apps/example/ui/layout';

// toogle this if you do not want dynamic loading, e.g. for debug purpose
const Apps = {
  'common.maya': Loadable({
    loader: () => import('../../apps/common/ui/layout'),
    loading: Loading,
  }),
  'example.maya': Loadable({
    loader: () => import('../../apps/example/ui/layout'),
    loading: Loading,
  }),
  localhost: Loadable({
    loader: () => import('../../apps/example/ui/layout'),
    loading: Loading,
  }),
};

class AppImporter extends React.Component {
  render() {
    const { props, state } = this;
    const host = parseHost(window.location.hostname);
    const App = Apps[host]; // toogle this if you do not want dynamic loading, e.g. for debug purpose
    return <App {...props} {...state} />;
  }
}

export default AppImporter;
