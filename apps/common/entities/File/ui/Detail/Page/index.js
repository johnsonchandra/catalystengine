import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import FileDetail from '..';
import FileEditor from '../../Editor';

import { setFileStatusToClosed } from '../../mutations.gql';

import detailFile from '../../queries.gql';

class FileDetailPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailFile: undefined,
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
            <Link to="/File">File</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailFile &&
              (data.detailFile.nr || data.detailFile.name || data.detailFile._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton bsStyle="default" title={SettingsIcon} id="dropdownbutton_FileDetailPage">
            <MenuItem onClick={() => history.push(`/QRCode/File/${data.detailFile._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailFile &&
              data.detailFile.status !== 'Draft' &&
              data.detailFile.status !== 'Closed' && (
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
          <FileDetail
            component={FileEditor}
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

FileDetailPage.propTypes = {
  setStatusToClosed: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setFileStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailFile, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('File Status set to Closed!', 'success');
        history.push('/File/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(FileDetailPage);
