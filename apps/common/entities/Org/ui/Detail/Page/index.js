import { Roles } from 'meteor/alanning:roles';
import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';
import ListGroup from '../../../../../ui/components/List/Group';

import parseDocs from '../../../../../helpers/parseDocs';

import OrgDetail from '..';
import OrgEditor from '../../Editor';
import ListRoles from '../../../../../ui/components/List/Roles';

import {
  setOrgStatusToClosed,
  updateOrgRoles as updateOrgRolesMutation,
} from '../../mutations.gql';

import detailOrg from '../../queries.gql';

import Styles from './styles';

class OrgDetailPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailOrg: undefined,
        activeTab: 'profile',
      },
    };
  }

  render() {
    const {
      userId,
      roles,
      updateOrgRoles,
      setStatusToClosed,
      settings,
      history,
      match,
    } = this.props;
    const { data, activeTab } = this.state;

    const parsedUsers = parseDocs(data.detailOrg && data.detailOrg.Users, [
      { from: '_id', to: '_id' },
      { from: 'fullname', to: 'title' },
      {
        from: (docUser) => docUser.roles.map((role) => (role.defaultChecked ? role.value : '')),
        to: 'subtitle',
      },
      {
        from: (docUser) => `/User/${docUser._id}`,
        to: 'linkUrl',
      },
    ]);

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Org">Org</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailOrg && (data.detailOrg.name || data.detailOrg._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton bsStyle="default" title={SettingsIcon} id="dropdownbutton_OrgDetailPage">
            <MenuItem onClick={() => history.push(`/QRCode/Org/${data.detailOrg._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailOrg &&
              data.detailOrg.status !== 'Draft' &&
              data.detailOrg.status !== 'Closed' &&
              Roles.userIsInRole(userId, 'admin') && (
                <React.Fragment>
                  <MenuItem divider />
                  <MenuItem header>STATUS</MenuItem>
                  <MenuItem onClick={setStatusToClosed}>
                    <Icon iconStyle="solid" icon="external-link-alt" />
                    {' Set to CLOSED'}
                  </MenuItem>
                </React.Fragment>
              )}
          </DropdownButton>
          <hr />
          <Styles.OrgTabs
            animation={false}
            activeKey={activeTab}
            onSelect={(selectedTab) => this.setState({ activeTab: selectedTab })}
            id="OrgDetailPageTabs"
          >
            <Tab eventKey="profile" title="Profile">
              <OrgDetail
                component={OrgEditor}
                parentFunc={(dataNow) => this.setState({ data: dataNow })}
                disabled
                updateDoc={() => {}}
                removeDoc={() => {}}
                history={history}
                match={match}
                settings={settings}
              />
            </Tab>
            <Tab eventKey="roles" title="Roles">
              <ListRoles
                party={data.detailOrg}
                disabled={!(roles.indexOf('admin') > -1)}
                updateDoc={(options, callback) => {
                  updateOrgRoles(options);
                  if (callback) callback();
                }}
              />
            </Tab>
            <Tab eventKey="users" title="Users">
              <ListGroup docs={parsedUsers} />
            </Tab>
          </Styles.OrgTabs>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

OrgDetailPage.propTypes = {
  userId: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  setStatusToClosed: PropTypes.func.isRequired,
  updateOrgRoles: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setOrgStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailOrg, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Org Status set to Closed!', 'success');
        history.push('/Org/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(updateOrgRolesMutation, {
    name: 'updateOrgRoles',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailOrg, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Org  Roles updated!', 'success');
      },
    }),
  }),
)(OrgDetailPage);
