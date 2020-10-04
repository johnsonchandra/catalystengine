import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import TenantDetail from '..';
import TenantEditor from '../../Editor';

import { setTenantStatusToClosed } from '../../mutations.gql';

import detailTenant from '../../queries.gql';

class TenantDetailPage extends React.Component {
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
    const { setStatusToClosed, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Tenant">Tenant</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailTenant &&
              (data.detailTenant.nr || data.detailTenant.name || data.detailTenant._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_TenantDetailPage"
          >
            <MenuItem onClick={() => history.push(`/QRCode/Tenant/${data.detailTenant._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailTenant &&
              data.detailTenant.status !== 'Draft' &&
              data.detailTenant.status !== 'Closed' && (
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
          <TenantDetail
            component={TenantEditor}
            parentFunc={(dataNow) => this.setState({ data: dataNow })}
            disabled
            updateDoc={() => {}}
            removeDoc={() => {}}
            history={history}
            match={match}
            settings={settings}
          />
        </React.Fragment>
      </React.Fragment>
    );
  }
}

TenantDetailPage.propTypes = {
  setStatusToClosed: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setTenantStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailTenant, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Tenant Status set to Closed!', 'success');
        history.push('/Root/Tenant/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(TenantDetailPage);
