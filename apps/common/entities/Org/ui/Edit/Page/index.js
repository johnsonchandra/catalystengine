import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import OrgDetail from '../../Detail';
import OrgEditor from '../../Editor';

import detailOrg from '../../queries.gql';

import { updateOrg, removeOrg, setOrgStatusToActive } from '../../mutations.gql';

class OrgEditPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailOrg: undefined,
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
            <Link to="/Org">Org</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailOrg && (data.detailOrg.name || data.detailOrg._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton bsStyle="default" title={SettingsIcon} id="dropdownbutton_OrgEditPage">
            <MenuItem onClick={() => history.push(`/QRCode/Org/${data.detailOrg._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailOrg && data.detailOrg.name && data.detailOrg.status === 'Draft' && (
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
          <OrgDetail
            component={OrgEditor}
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

OrgEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateOrg, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailOrg, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Org updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeOrg, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('Org deleted!', 'success');
        history.push('/Org/draft');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setOrgStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailOrg, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Org Status set to Active!', 'success');
        history.push('/Org/current');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(OrgEditPage);
