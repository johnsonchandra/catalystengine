import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';

import SearchInput from '../../../../../../../ui/components/SearchInput';
import SettingsIcon from '../../../../../../../ui/components/Icon/Settings';
import Icon from '../../../../../../../ui/components/Icon';
import TableSimple from '../../../../../../../ui/components/Table/Simple';
import Styles from '../../../../../../../ui/layout/CommonStyle';

import parser from '../../../../Parser';

import OrgListCurrentHost from '..';

import { addOrg } from '../../../../mutations.gql';

class OrgListCurrentHostPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      currentPage: 1,
    };
  }

  render() {
    const { mutate, history, settings } = this.props;
    const { search, currentPage } = this.state;
    const { perPage } = settings;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Org">Org</Link>
          </li>
          <Breadcrumb.Item active>Current</Breadcrumb.Item>
        </Breadcrumb>
        <Styles.Header className="page-header clearfix">
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_OrgListCurrentHostPage"
          >
            <MenuItem onClick={mutate}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Create new'}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => history.push('/Org/draft')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Draft'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/Org/current/feature')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Current Feature'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/Org/history')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' History'}
            </MenuItem>
          </DropdownButton>
          <SearchInput
            placeholder="Search Org..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </Styles.Header>

        <OrgListCurrentHost
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

OrgListCurrentHostPage.propTypes = {
  mutate: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(addOrg, {
    options: ({ history }) => ({
      onCompleted: (mutation) => {
        history.push(`/Org/${mutation.addOrg._id}/edit`);
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(OrgListCurrentHostPage);
