import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import CounterDetail from '../../Detail';
import CounterEditor from '../../Editor';

import detailCounter from '../../queries.gql';

import { updateCounter, removeCounter, setCounterStatusToActive } from '../../mutations.gql';

class CounterEditPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      data: {
        detailCounter: undefined,
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
            <Link to="/Counter">Counter</Link>
          </li>
          <Breadcrumb.Item active>
            {`Edit / ${data.detailCounter &&
              (data.detailCounter.nr || data.detailCounter.name || data.detailCounter._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_CounterEditPage"
          >
            <MenuItem onClick={() => history.push(`/QRCode/Counter/${data.detailCounter._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailCounter &&
              data.detailCounter.counter &&
              data.detailCounter.type &&
              data.detailCounter.status === 'Draft' && (
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
          <CounterDetail
            component={CounterEditor}
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

CounterEditPage.propTypes = {
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  setStatusToActive: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(updateCounter, {
    name: 'updateDoc',
    options: ({ match }) => ({
      refetchQueries: [{ query: detailCounter, variables: { _id: match.params._id } }],
      onCompleted: () => {
        Bert.alert('Counter updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeCounter, {
    name: 'removeDoc',
    options: ({ history }) => ({
      onCompleted: () => {
        Bert.alert('Counter deleted!', 'success');
        history.push('/Counter/Draft');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(setCounterStatusToActive, {
    name: 'setStatusToActive',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailCounter, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Counter Status set to Active!', 'success');
        history.push('/Counter');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(CounterEditPage);
