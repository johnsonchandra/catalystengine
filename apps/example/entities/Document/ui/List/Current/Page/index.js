import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';

import SearchInput from '../../../../../../../common/ui/components/SearchInput';
import SettingsIcon from '../../../../../../../common/ui/components/Icon/Settings';
import Icon from '../../../../../../../common/ui/components/Icon';
import TableSimple from '../../../../../../../common/ui/components/Table/Simple';

import parser from '../../../Parser';

import DocumentListCurrent from '..';

import { StyledHeader } from './styles';

import { addDocument } from '../../../mutations.gql';

class DocumentListCurrentPage extends React.Component {
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
            <Link to="/Document">Document</Link>
          </li>
          <Breadcrumb.Item active>Current</Breadcrumb.Item>
        </Breadcrumb>
        <StyledHeader className="page-header clearfix">
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_DocumentListCurrentPage"
          >
            <MenuItem onClick={mutate}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Create new'}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => history.push('/Document/draft')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Draft'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/Document/history')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' History'}
            </MenuItem>
          </DropdownButton>
          <SearchInput
            placeholder="Search Document..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </StyledHeader>

        <DocumentListCurrent
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

DocumentListCurrentPage.propTypes = {
  mutate: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(addDocument, {
    options: ({ history }) => ({
      onCompleted: (mutation) => {
        history.push(`/Document/${mutation.addDocument._id}/edit`);
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(DocumentListCurrentPage);
