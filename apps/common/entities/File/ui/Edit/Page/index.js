import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import FileDetail from '../../Detail';
import FileEditor from '../../Editor';

import detailFile from '../../queries.gql';

import { updateFile, removeFile, setFileStatusToActive } from '../../mutations.gql';

class FileEditPage extends React.Component {
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
    const { updateDoc, removeDoc, setStatusToActive, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/File">File</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailFile &&
              (data.detailFile.nr || data.detailFile.name || data.detailFile._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton bsStyle="default" title={SettingsIcon} id="dropdownbutton_FileEditPage">
            <MenuItem onClick={() => history.push(`/QRCode/File/${data.detailFile._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailFile && data.detailFile.name && data.detailFile.status === 'Draft' && (
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
          <FileDetail
            component={FileEditor}
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
          <hr />
          <p> di sini link ke file</p>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

FileEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateFile, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailFile, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('File updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeFile, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('File deleted!', 'success');
        history.push('/File/Draft');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setFileStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailFile, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('File Status set to Active!', 'success');
        history.push('/File');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(FileEditPage);
