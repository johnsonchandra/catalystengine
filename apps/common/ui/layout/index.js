import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import withTrackerSsr from '../../helpers/withTrackerSsr';
import initApp from '../../helpers/initApp';

import GlobalStyle from './GlobalStyle';
import Styles from './styles';

import Navigation from './Navigation';
import Home from './Home';

// common components
import Authenticated from '../components/Route/Authenticated';
import Authorized from '../components/Route/Authorized';
import Public from '../components/Route/Public';
import NotAuthorized from '../components/NotAuthorized';
import NotFound from '../components/NotFound';
import Footer from '../components/Footer/App';
import VerifyEmailAlert from '../components/VerifyEmailAlert';
import ModalGDPRConsent from '../components/Modal/GDPRConsent';

// common Pages
import PageTerms from '../components/Page/Terms';
import PagePrivacy from '../components/Page/Privacy';
import PageExample from '../components/Page/Example';

// User Pages
import UserSignupPage from '../../entities/User/ui/Signup/Page';
import UserLoginPage from '../../entities/User/ui/Login/Page';
import UserLogoutPage from '../../entities/User/ui/Logout/Page';
import UserRecoverPasswordPage from '../../entities/User/ui/Password/Recover/Page';
import UserResetPasswordPage from '../../entities/User/ui/Password/Reset/Page';
import UserProfilePage from '../../entities/User/ui/Profile/Page';
import VerifyEmail from '../../entities/User/ui/VerifyEmail';

// Admin User Pages
import UserDetailPage from '../../entities/User/ui/Detail/Page';
import UserListCurrentHostPage from '../../entities/User/ui/List/Current/Host/Page';
import UserListOnlineHostPage from '../../entities/User/ui/List/Online/Host/Page';

// Root User Pages
import UserListCurrentAllPage from '../../entities/User/ui/List/Current/All/Page';
import UserListOnlineAllPage from '../../entities/User/ui/List/Online/All/Page';

// Root Tenant pages
import TenantListDraftPage from '../../entities/Tenant/ui/List/Draft/Page';
import TenantListCurrentPage from '../../entities/Tenant/ui/List/Current/Page';
import TenantListHistoryPage from '../../entities/Tenant/ui/List/History/Page';
import TenantDetailPage from '../../entities/Tenant/ui/Detail/Page';
import TenantEditPage from '../../entities/Tenant/ui/Edit/Page';

// Admin UserSetting pages
import UserSettingListCurrentHost from '../../entities/UserSetting/ui/List/Current/Host';

// Root UserSetting pages
import UserSettingListCurrentAll from '../../entities/UserSetting/ui/List/Current/All';

// Admin Org pages
import OrgListDraftAllPage from '../../entities/Org/ui/List/Draft/All/Page';
import OrgListDraftHostPage from '../../entities/Org/ui/List/Draft/Host/Page';
import OrgListCurrentAllPage from '../../entities/Org/ui/List/Current/All/Page';
import OrgListCurrentHostPage from '../../entities/Org/ui/List/Current/Host/Page';
import OrgListCurrentFeatureAllPage from '../../entities/Org/ui/List/CurrentFeature/All/Page';
import OrgListCurrentFeatureHostPage from '../../entities/Org/ui/List/CurrentFeature/Host/Page';
import OrgListHistoryAllPage from '../../entities/Org/ui/List/History/All/Page';
import OrgListHistoryHostPage from '../../entities/Org/ui/List/History/Host/Page';
import OrgDetailPage from '../../entities/Org/ui/Detail/Page';
import OrgEditPage from '../../entities/Org/ui/Edit/Page';

// Admin Counter pages
import CounterDraftListPage from '../../entities/Counter/ui/List/Draft/Page';
import CounterCurrentListPage from '../../entities/Counter/ui/List/Current/Page';
import CounterHistoryListPage from '../../entities/Counter/ui/List/History/Page';
import CounterDetailPage from '../../entities/Counter/ui/Detail/Page';
import CounterEditPage from '../../entities/Counter/ui/Edit/Page';

// File pages
import FileDraftListPage from '../../entities/File/ui/List/Draft/Page';
import FileCurrentListPage from '../../entities/File/ui/List/Current/Page';
import FileHistoryListPage from '../../entities/File/ui/List/History/Page';
import FileDetailPage from '../../entities/File/ui/Detail/Page';
import FileEditPage from '../../entities/File/ui/Edit/Page';
import FileUploadFSPage from '../../entities/File/ui/Upload/FS/Page';
import FileUploadS3Page from '../../entities/File/ui/Upload/S3/Page';

// Document pages
import DocumentDraftListPage from '../../../example/entities/Document/ui/List/Draft/Page';
import DocumentCurrentListPage from '../../../example/entities/Document/ui/List/Current/Page';
import DocumentHistoryListPage from '../../../example/entities/Document/ui/List/History/Page';
import DocumentDetailPage from '../../../example/entities/Document/ui/Detail/Page';
import DocumentEditPage from '../../../example/entities/Document/ui/Edit/Page';

class CommonApp extends React.Component {
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

              {/* File route */}
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File"
                component={FileDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/draft"
                component={FileDraftListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/current"
                component={FileCurrentListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['spv', 'admin']}
                path="/File/history"
                component={FileHistoryListPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/FS/upload"
                component={FileUploadFSPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/S3/upload"
                component={FileUploadS3Page}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/:_id"
                component={FileDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['member', 'spv', 'admin']}
                path="/File/:_id/edit"
                component={FileEditPage}
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
                component={UserSettingListCurrentHost}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                path="/UserSetting/current"
                pathAfterFailure="/"
                component={UserSettingListCurrentHost}
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

              {/* ROOT route */}
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/User"
                pathAfterFailure="/"
                component={UserListOnlineAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/User/online"
                pathAfterFailure="/"
                component={UserListOnlineAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/User/current"
                pathAfterFailure="/"
                component={UserListCurrentAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/UserSetting"
                pathAfterFailure="/"
                component={UserSettingListCurrentAll}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Org"
                pathAfterFailure="/"
                component={OrgListDraftAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Org/draft"
                pathAfterFailure="/"
                component={OrgListDraftAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Org/current"
                pathAfterFailure="/"
                component={OrgListCurrentAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Org/current/feature"
                pathAfterFailure="/"
                component={OrgListCurrentFeatureAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Org/history"
                pathAfterFailure="/"
                component={OrgListHistoryAllPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />

              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant"
                pathAfterFailure="/"
                component={TenantListDraftPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant/draft"
                pathAfterFailure="/"
                component={TenantListDraftPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant/current"
                pathAfterFailure="/"
                component={TenantListCurrentPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant/history"
                pathAfterFailure="/"
                component={TenantListHistoryPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant/:_id"
                pathAfterFailure="/"
                component={TenantDetailPage}
                setAfterLoginPath={setAfterLoginPath}
                {...props}
                {...state}
              />
              <Authorized
                exact
                allowedRoles={['admin']}
                allowedGroup="ROOT"
                path="/Root/Tenant/:_id/edit"
                pathAfterFailure="/"
                component={TenantEditPage}
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
          <Footer />
        </Styles.App>
      </React.Fragment>
    );
  }
}

CommonApp.defaultProps = {
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

CommonApp.propTypes = {
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

export default withTrackerSsr(() => initApp())(CommonApp);
