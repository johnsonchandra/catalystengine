import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';
import SEO from '../../../../../ui/components/SEO';

import NotificationDetail from '..';
import NotificationEditor from '../../Editor';

import { setNotificationStatusToClosed } from '../../mutations.gql';

import detailNotification from '../../queries.gql';

class NotificationDetailPage extends React.Component {
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
    const { setStatusToClosed, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <SEO
          title={data.notification && data.notification.title}
          description={data.notification && data.notification.description}
          path={`Notification/${data.notification && data.notification._id}`}
          contentType="article"
          published={data.notification && data.notification.createdAt}
          updated={data.notification && data.notification.updatedAt}
        />
        <Breadcrumb>
          <li>
            <Link to="/Notification">Notification</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailNotification &&
              (data.detailNotification.nr ||
                data.detailNotification.name ||
                data.detailNotification._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_NotificationDetailPage"
          >
            <MenuItem
              onClick={() => history.push(`/QRCode/Notification/${data.detailNotification._id}`)}
            >
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailNotification &&
              data.detailNotification.status !== 'Draft' &&
              data.detailNotification.status !== 'Closed' && (
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
          <NotificationDetail
            component={NotificationEditor}
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

NotificationDetailPage.propTypes = {
  setStatusToClosed: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setNotificationStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailNotification, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Notification Status set to Closed!', 'success');
        history.push('/Notification/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(NotificationDetailPage);
