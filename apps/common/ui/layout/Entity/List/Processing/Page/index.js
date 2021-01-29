import React from 'react';
import PropTypes from 'prop-types';

import { Breadcrumb } from 'react-bootstrap';

import SearchInput from '../../../../../components/SearchInput';
import TableSimple from '../../../../../components/Table/Simple';
import Styles from '../../../../CommonStyle';

import parser from '../../../Parser';

import EntityListProcessing from '../index';

class EntityListProcessingPage extends React.Component {
  state = {
    currentPage: 1,
  };

  render() {
    const { settings } = this.props;
    const { search, currentPage } = this.state;
    const { perPage } = settings;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>Entity</li>
          <Breadcrumb.Item active>Processing</Breadcrumb.Item>
        </Breadcrumb>
        <Styles.Header className="page-header clearfix">
          <SearchInput
            placeholder="Search Processing..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </Styles.Header>

        <EntityListProcessing
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

EntityListProcessingPage.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default EntityListProcessingPage;
