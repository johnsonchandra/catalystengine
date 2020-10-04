import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../../common/ui/components/Icon';
import SettingsIcon from '../../../../../../common/ui/components/Icon/Settings';
import SEO from '../../../../../../common/ui/components/SEO';

import DocumentDetail from '..';
import DocumentEditor from '../../Editor';

import { setDocumentStatusToClosed } from '../../mutations.gql';

import detailDocument from '../../queries.gql';

class DocumentDetailPage extends React.Component {
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
    const { setStatusToClosed, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <SEO
          title={data.document && data.document.title}
          description={data.document && data.document.description}
          path={`Document/${data.document && data.document._id}`}
          contentType="article"
          published={data.document && data.document.createdAt}
          updated={data.document && data.document.updatedAt}
        />
        <Breadcrumb>
          <li>
            <Link to="/Document">Document</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailDocument &&
              (data.detailDocument.nr || data.detailDocument.name || data.detailDocument._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_DocumentDetailPage"
          >
            <MenuItem onClick={() => history.push(`/QRCode/Document/${data.detailDocument._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailDocument &&
              data.detailDocument.status !== 'Draft' &&
              data.detailDocument.status !== 'Closed' && (
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
          <DocumentDetail
            component={DocumentEditor}
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

DocumentDetailPage.propTypes = {
  setStatusToClosed: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setDocumentStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailDocument, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Document Status set to Closed!', 'success');
        history.push('/Document/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(DocumentDetailPage);
