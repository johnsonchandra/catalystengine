import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import TenantDetail from '../../Detail';
import TenantEditor from '../../Editor';

import detailTenant from '../../queries.gql';

import { updateTenant, removeTenant, setTenantStatusToActive } from '../../mutations.gql';

class TenantEditPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailTenant: undefined,
      },
    };
  }

  render() {
    const { updateDoc, removeDoc, setStatusToActive, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Root/Tenant">Root / Tenant</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailTenant &&
              (data.detailTenant.nr || data.detailTenant.name || data.detailTenant._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton bsStyle="default" title={SettingsIcon} id="dropdownbutton_TenantEditPage">
            <MenuItem onClick={() => history.push(`/QRCode/Tenant/${data.detailTenant._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailTenant &&
              data.detailTenant.nr &&
              data.detailTenant.name &&
              data.detailTenant.amount &&
              data.detailTenant.trxDate &&
              data.detailTenant.status === 'Draft' && (
                <React.Fragment>
                  <MenuItem divider />
                  <MenuItem header>STATUS</MenuItem>
                  <MenuItem onClick={setStatusToActive}>
                    <Icon iconStyle="solid" icon="external-link-alt" />
                    {' Set to ACTIVE'}
                  </MenuItem>
                </React.Fragment>
              )}
          </DropdownButton>
          <hr />
          <TenantDetail
            component={TenantEditor}
            parentFunc={(dataNow) => this.setState({ data: dataNow })}
            disabled={false}
            updateDoc={(options, dataNow) => {
              updateDoc(options);
              if (dataNow) {
                this.setState({ data: dataNow });
              }
            }}
            removeDoc={removeDoc}
            history={history}
            match={match}
            settings={settings}
          />
        </React.Fragment>
      </React.Fragment>
    );
  }
}

TenantEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateTenant, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailTenant, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Tenant updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeTenant, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('Tenant deleted!', 'success');
        history.push('/Root/Tenant/current');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setTenantStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailTenant, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Tenant Status set to Active!', 'success');
        history.push('/Root/Tenant');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(TenantEditPage);
