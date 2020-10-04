import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';
import { Breadcrumb, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Icon from '../../../../../ui/components/Icon';
import SettingsIcon from '../../../../../ui/components/Icon/Settings';

import CounterDetail from '..';
import CounterEditor from '../../Editor';

import { setCounterStatusToClosed } from '../../mutations.gql';

import detailCounter from '../../queries.gql';

class CounterDetailPage extends React.Component {
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
    const { setStatusToClosed, settings, history, match } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb>
          <li>
            <Link to="/Counter">Counter</Link>
          </li>
          <Breadcrumb.Item active>
            {`Detail / ${data.detailCounter &&
              (data.detailCounter.nr || data.detailCounter.name || data.detailCounter._id)}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <React.Fragment>
          <DropdownButton
            bsStyle="default"
            title={SettingsIcon}
            id="dropdownbutton_CounterDetailPage"
          >
            <MenuItem onClick={() => history.push(`/QRCode/Counter/${data.detailCounter._id}`)}>
              <Icon iconStyle="solid" icon="qrcode" />
              {' Show QR-Code'}
            </MenuItem>
            {data.detailCounter &&
              data.detailCounter.status !== 'Draft' &&
              data.detailCounter.status !== 'Closed' && (
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
          <CounterDetail
            component={CounterEditor}
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

CounterDetailPage.propTypes = {
  setStatusToClosed: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  graphql(setCounterStatusToClosed, {
    name: 'setStatusToClosed',
    options: ({ match, history }) => ({
      refetchQueries: [{ query: detailCounter, variables: { _id: match.params._id } }],
      variables: {
        _id: match.params._id,
      },
      onCompleted: () => {
        Bert.alert('Counter Status set to Closed!', 'success');
        history.push('/Counter/history');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(CounterDetailPage);
