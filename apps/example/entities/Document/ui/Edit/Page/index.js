import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../../common/ui/components/Icon';
import SettingsIcon from '../../../../../../common/ui/components/Icon/Settings';

import DocumentDetail from '../../Detail';
import DocumentEditor from '../../Editor';

import detailDocument from '../../queries.gql';

import { updateDocument, removeDocument, setDocumentStatusToActive } from '../../mutations.gql';

class DocumentEditPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailDocument: undefined,
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
            <Link to="/Document">Document</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailDocument &&
              (data.detailDocument.nr || data.detailDocument.name || data.detailDocument._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_DocumentEditPage"
          >
            <MenuItem onClick={() => history.push(`/QRCode/Document/${data.detailDocument._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailDocument &&
              data.detailDocument.nr &&
              data.detailDocument.name &&
              data.detailDocument.amount &&
              data.detailDocument.trxDate &&
              data.detailDocument.status === 'Draft' && (
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
          <DocumentDetail
            component={DocumentEditor}
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

DocumentEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateDocument, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailDocument, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Document updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeDocument, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('Document deleted!', 'success');
        history.push('/Document/draft');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setDocumentStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailDocument, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Document Status set to Active!', 'success');
        history.push('/Document/current');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(DocumentEditPage);
