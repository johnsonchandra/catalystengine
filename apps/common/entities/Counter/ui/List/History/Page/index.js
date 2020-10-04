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

import parser from '../../../Parser';

import CounterListHistory from '..';

import { StyledHeader } from './styles';

import { addCounter } from '../../../mutations.gql';

class CounterListHistoryPage extends React.Component {
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
            <Link to="/Counter">Counter</Link>
          </li>
          <Breadcrumb.Item active>History</Breadcrumb.Item>
        </Breadcrumb>
        <StyledHeader className="page-header clearfix">
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_CounterListHistoryPage"
          >
            <MenuItem onClick={mutate}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Create new'}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => history.push('/Counter/draft')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Draft'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/Counter/current')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Current'}
            </MenuItem>
          </DropdownButton>
          <SearchInput
            placeholder="Search Counter..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </StyledHeader>

        <CounterListHistory
          parser={parser}
          component={TableSimple}
          settings={settings}
          search={search}
          currentPage={currentPage}
          perPage={perPage}
          onChangePage={(currentPageNow) => this.setState({ currentPage: currentPageNow })}
        />
      </React.Fragment>
    );
  }
}

CounterListHistoryPage.propTypes = {
  mutate: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(addCounter, {
    options: ({ history }) => ({
      onCompleted: (mutation) => {
        history.push(`/Counter/${mutation.addCounter._id}/edit`);
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(CounterListHistoryPage);
