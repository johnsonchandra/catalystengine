import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Loading from '../../../../../ui/components/Loading';
import BlankState from '../../../../../ui/components/BlankState';

import UserDetail from '..';
import ListRoles from '../../../../../ui/components/List/Roles';
import UserSettings from '../../Settings';

import { detailUser } from '../../queries.gql';
import {
  updateUser as updateUserMutation,
  updateUserRoles as updateUserRolesMutation,
} from '../../mutations.gql';

import Styles from './styles';

class UserDetailPage extends React.Component {
  state = { activeTab: 'profile' };

  render() {
    const { data, updateUser, updateUserRoles, roles } = this.props;
    const { activeTab } = this.state;
    const name = data.detailUser && data.detailUser.fullname;
    const username = data.detailUser && data.detailUser.username;

    if (data.loading) return <Loading />;
    if (!data.detailUser) return <BlankState title="User not Found" subtitle="" />;

    return (
      <div className="User">
        <Breadcrumb>
          <li>
            <Link to="/User">User</Link>
          </li>
          <Breadcrumb.Item active>{name || username}</Breadcrumb.Item>
        </Breadcrumb>
        <Styles.UserTabs
          animation={false}
          activeKey={activeTab}
          onSelect={(selectedTab) => this.setState({ activeTab: selectedTab })}
          id="UserDetailPageTabs"
        >
          <Tab eventKey="profile" title="Profile">
            <UserDetail
              user={data.detailUser}
              roles={roles}
              updateDoc={(options, callback) => {
                // NOTE: Do this to allow us to perform work inside of UserDetail
                // after a successful update. Not ideal, but hey, c'est la vie.
                updateUser(options);
                if (callback) callback();
              }}
            />
          </Tab>
          <Tab eventKey="roles" title="Roles">
            <ListRoles
              party={data.detailUser}
              disabled={!(roles.indexOf('admin') > -1)}
              updateDoc={(options, callback) => {
                updateUserRoles(options);
                if (callback) callback();
              }}
            />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <UserSettings
              userId={data.detailUser._id}
              settings={data.detailUser.settings}
              updateDoc={updateUser}
            />
          </Tab>
        </Styles.UserTabs>
      </div>
    );
  }
}

UserDetailPage.defaultProps = {
  roles: [],
};

UserDetailPage.propTypes = {
  data: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateUserRoles: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default compose(
  graphql(detailUser, {
    options: ({ match }) => ({
      fetchPolicy: 'no-cache',
      variables: {
        _id: match.params._id,
      },
    }),
  }),
  graphql(updateUserMutation, {
    name: 'updateUser',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailUser, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('User updated!', 'success');
      },
    }),
  }),
  graphql(updateUserRolesMutation, {
    name: 'updateUserRoles',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailUser, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('User Roles updated!', 'success');
      },
    }),
  }),
)(UserDetailPage);
