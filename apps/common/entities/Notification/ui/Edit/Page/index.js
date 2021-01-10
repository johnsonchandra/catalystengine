import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import NotificationDetail from '../../Detail';
import NotificationEditor from '../../Editor';

import detailNotification from '../../queries.gql';

import {
  updateNotification,
  removeNotification,
  setNotificationStatusToActive,
} from '../../mutations.gql';

class NotificationEditPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailNotification: undefined,
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
            <Link to="/Notification">Notification</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailNotification &&
              (data.detailNotification.nr ||
                data.detailNotification.name ||
                data.detailNotification._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_NotificationEditPage"
          >
            <MenuItem
              onClick={() => history.push(`/QRCode/Notification/${data.detailNotification._id}`)}
            >
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailNotification &&
              data.detailNotification.nr &&
              data.detailNotification.name &&
              data.detailNotification.amount &&
              data.detailNotification.trxDate &&
              data.detailNotification.status === 'Draft' && (
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
          <NotificationDetail
            component={NotificationEditor}
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

NotificationEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateNotification, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailNotification, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Notification updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeNotification, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('Notification deleted!', 'success');
        history.push('/Notification/draft');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setNotificationStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailNotification, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Notification Status set to Active!', 'success');
        history.push('/Notification/current');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(NotificationEditPage);
