import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import withTrackerSsr from '../../../common/helpers/withTrackerSsr';
import initApp from '../../../common/helpers/initApp';

import GlobalStyle from './GlobalStyle';
import Styles from './styles';

import Navigation from './Navigation';
import Home from './Home';

// common components
import Authenticated from '../../../common/ui/components/Route/Authenticated';
import Authorized from '../../../common/ui/components/Route/Authorized';
import Public from '../../../common/ui/components/Route/Public';
import NotAuthorized from '../../../common/ui/components/NotAuthorized';
import NotFound from '../../../common/ui/components/NotFound';
import Footer from '../../../common/ui/components/Footer/App';
import VerifyEmailAlert from '../../../common/ui/components/VerifyEmailAlert';
import ModalGDPRConsent from '../../../common/ui/components/Modal/GDPRConsent';

// common Pages
import PageTerms from '../../../common/ui/components/Page/Terms';
import PagePrivacy from '../../../common/ui/components/Page/Privacy';
import PageExample from '../../../common/ui/components/Page/Example';

// User Pages
import UserSignupPage from '../../../common/entities/User/ui/Signup/Page';
import UserLoginPage from '../../../common/entities/User/ui/Login/Page';
import UserLogoutPage from '../../../common/entities/User/ui/Logout/Page';
import UserRecoverPasswordPage from '../../../common/entities/User/ui/Password/Recover/Page';
import UserResetPasswordPage from '../../../common/entities/User/ui/Password/Reset/Page';
import UserProfilePage from '../../../common/entities/User/ui/Profile/Page';
import VerifyEmail from '../../../common/entities/User/ui/VerifyEmail';

// Admin User pages
import UserDetailPage from '../../../common/entities/User/ui/Detail/Page';
import UserListCurrentHostPage from '../../../common/entities/User/ui/List/Current/Host/Page';
import UserListOnlineHostPage from '../../../common/entities/User/ui/List/Online/Host/Page';

// Admin UserSetting pages
import UserSettingListCurrent from '../../../common/entities/UserSetting/ui/List/Current/Host';

// Admin Org pages
import OrgListDraftHostPage from '../../../common/entities/Org/ui/List/Draft/Host/Page';
import OrgListCurrentHostPage from '../../../common/entities/Org/ui/List/Current/Host/Page';
import OrgListCurrentFeatureHostPage from '../../../common/entities/Org/ui/List/CurrentFeature/Host/Page';
import OrgListHistoryHostPage from '../../../common/entities/Org/ui/List/History/Host/Page';
import OrgDetailPage from '../../../common/entities/Org/ui/Detail/Page';
import OrgEditPage from '../../../common/entities/Org/ui/Edit/Page';

// Admin Counter pages
import CounterDraftListPage from '../../../common/entities/Counter/ui/List/Draft/Page';
import CounterCurrentListPage from '../../../common/entities/Counter/ui/List/Current/Page';
import CounterHistoryListPage from '../../../common/entities/Counter/ui/List/History/Page';
import CounterDetailPage from '../../../common/entities/Counter/ui/Detail/Page';
import CounterEditPage from '../../../common/entities/Counter/ui/Edit/Page';

// Document pages
import DocumentDraftListPage from '../../entities/Document/ui/List/Draft/Page';
import DocumentCurrentListPage from '../../entities/Document/ui/List/Current/Page';
import DocumentHistoryListPage from '../../entities/Document/ui/List/History/Page';
import DocumentDetailPage from '../../entities/Document/ui/Detail/Page';
import DocumentEditPage from '../../entities/Document/ui/Edit/Page';

class ExampleApp extends React.Component {
  state = { ready: false, afterLoginPath: null };

  componentDidMount() {
    this.setPageReady();
  }

  setPageReady = () => {
    this.setState({ ready: true });
  };

  setAfterLoginPath = (afterLoginPath) => {
    this.setState({ afterLoginPath });
  };

  render() {
    const { props, state, setAfterLoginPath } = this;

    return (
      <React.Fragment>
        <GlobalStyle />
        <Styles.App ready={state.ready} loading={`${props.loading}`}>
          {props.authenticated && (
            <VerifyEmailAlert
              userId={props.userId}
              emailVerified={props.emailVerified}
              emailAddress={props.emailAddress}
            />
          )}
          {props.authenticated && <ModalGDPRConsent {...props} {...state} />}
          <Navigation {...props} {...state} />
          <Grid>
            <Switch>
              <Route exact name="index" path="/" component={Home} />

              {/* Counter route */}
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Counter"
                component={CounterDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Counter/draft"
                component={CounterDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Counter/current"
                component={CounterCurrentListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['spv', 'admin']}
                path="/Counter/history"
                component={CounterHistoryListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Counter/:_id"
                component={CounterDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Counter/:_id/edit"
                component={CounterEditPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* Document route */}
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Document"
                component={DocumentDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Document/draft"
                component={DocumentDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Document/current"
                component={DocumentCurrentListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['spv', 'admin']}
                path="/Document/history"
                component={DocumentHistoryListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Document/:_id"
                component={DocumentDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/Document/:_id/edit"
                component={DocumentEditPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* User route */}
              <Authenticated
                exact
                path="/profile"
                component={UserProfilePage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* Admin User route */}
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/User"
                pathAfterFailure="/"
                component={UserListOnlineHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/User/online"
                pathAfterFailure="/"
                component={UserListOnlineHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/User/current"
                pathAfterFailure="/"
                component={UserListCurrentHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/User/:_id"
                pathAfterFailure="/"
                component={UserDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* UserSetting route */}
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/UserSetting"
                pathAfterFailure="/"
                component={UserSettingListCurrent}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/UserSetting/current"
                pathAfterFailure="/"
                component={UserSettingListCurrent}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* Org route */}
              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org"
                pathAfterFailure="/"
                component={OrgListDraftHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org/draft"
                pathAfterFailure="/"
                component={OrgListDraftHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org/current"
                pathAfterFailure="/"
                component={OrgListCurrentHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org/current/feature"
                pathAfterFailure="/"
                component={OrgListCurrentFeatureHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['spv']}
                path="/Org/history"
                pathAfterFailure="/"
                component={OrgListHistoryHostPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org/:_id"
                pathAfterFailure="/"
                component={OrgDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv']}
                path="/Org/:_id/edit"
                pathAfterFailure="/"
                component={OrgEditPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              {/* ALL route */}
              <Public path="/signup" component={UserSignupPage} {...props} {...state} />
              <Public path="/login" component={UserLoginPage} {...props} {...state} />
              <Route
                path="/logout"
                render={(routeProps) => (
                  <UserLogoutPage {...routeProps} setAfterLoginPath={setAfterLoginPath} />
                )}
                {...props}
                {...state}
              />

              <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
              <Route
                name="recover-password"
                path="/recover-password"
                component={UserRecoverPasswordPage}
              />
              <Route
                name="reset-password"
                path="/reset-password/:token"
                component={UserResetPasswordPage}
              />

              <Route name="terms" path="/terms" component={PageTerms} />
              <Route name="privacy" path="/privacy" component={PagePrivacy} />
              <Route name="examplePage" path="/example-page" component={PageExample} />

              <Route name="NotAuthorized" path="/NotAuthorized" component={NotAuthorized} />
              <Route component={NotFound} />
            </Switch>
          </Grid>
          <Footer {...props} {...state} />
        </Styles.App>
      </React.Fragment>
    );
  }
}

ExampleApp.defaultProps = {
  loading: true,
  user: {},
  userId: '',
  emailAddress: '',
  emailVerified: false,
  authenticated: false,
  settings: {},
  roles: [],
  host: '',
};

ExampleApp.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool,
  authenticated: PropTypes.bool,
  settings: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.string),
  host: PropTypes.string,
};

export default withTrackerSsr(() => initApp())(ExampleApp);
