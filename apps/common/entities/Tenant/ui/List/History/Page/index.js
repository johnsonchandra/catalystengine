import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';

import SearchInput from '../../../../../../ui/components/SearchInput';
import SettingsIcon from '../../../../../../ui/components/Icon/Settings';
import Icon from '../../../../../../ui/components/Icon';
import TableSimple from '../../../../../../ui/components/Table/Simple';
import Styles from '../../../../../../ui/layout/CommonStyle';

import parser from '../../../Parser';

import TenantListHistory from '..';

import { addTenant } from '../../../mutations.gql';

class TenantListHistoryPage extends React.Component {
  state = {
    currentPage: 1,
  };

  render() {
    const { mutate, history, settings } = this.props;
    const { search, currentPage } = this.state;
    const { perPage } = settings;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Root/Tenant">Root / Tenant</Link>
          </li>
          <Breadcrumb.Item active>History</Breadcrumb.Item>
        </Breadcrumb>
        <Styles.Header className="page-header clearfix">
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_TenantListHistoryPage"
          >
            <MenuItem onClick={mutate}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Create new'}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => history.push('/Root/Tenant/draft')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Draft'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/Root/Tenant/current')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Current'}
            </MenuItem>
          </DropdownButton>
          <SearchInput
            placeholder="Search Tenant..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </Styles.Header>

        <TenantListHistory
          parser={parser}
          component={TableSimple}
          settings={settings}
          search={(search && search.length) >= (settings.minCharSearch || 3)}
          currentPage={currentPage}
          perPage={perPage}
          onChangePage={(currentPageNow) => this.setState({ currentPage: currentPageNow })}
        />
      </React.Fragment>
    );
  }
}

TenantListHistoryPage.propTypes = {
  mutate: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(addTenant, {
    options: ({ history }) => ({
      onCompleted: (mutation) => {
        history.push(`/Root/Tenant/${mutation.addTenant._id}/edit`);
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(TenantListHistoryPage);
