import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';

import SearchInput from '../../../../../../ui/components/SearchInput';
import SettingsIcon from '../../../../../../ui/components/Icon/Settings';
import Icon from '../../../../../../ui/components/Icon';
import TableSimple from '../../../../../../ui/components/Table/Simple';
import Styles from '../../../../../../ui/layout/CommonStyle';

import parser from '../../../Parser';

import FileListHistory from '..';

class FileListHistoryPage extends React.Component {
  state = {
    currentPage: 1,
  };

  render() {
    const { history, settings } = this.props;
    const { search, currentPage } = this.state;
    const { perPage } = settings;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/File">File</Link>
          </li>
          <Breadcrumb.Item active>History</Breadcrumb.Item>
        </Breadcrumb>
        <Styles.Header className="page-header clearfix">
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_FileListHistoryPage"
          >
            <MenuItem onClick={() => history.push('/File/FS/upload')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Upload File to FS'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/File/S3/upload')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Upload File to S3'}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => history.push('/File/draft')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Draft'}
            </MenuItem>
            <MenuItem onClick={() => history.push('/File/current')}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {' Current'}
            </MenuItem>
          </DropdownButton>
          <SearchInput
            placeholder="Search File..."
            value={search}
            onChange={(event) => {
              this.setState({ search: event.target.value, currentPage: 1 });
            }}
          />
        </Styles.Header>

        <FileListHistory
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

FileListHistoryPage.propTypes = {
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default FileListHistoryPage;
