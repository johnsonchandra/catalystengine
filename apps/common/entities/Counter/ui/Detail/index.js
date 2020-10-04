import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';

import Loading from '../../../../ui/components/Loading';
import BlankState from '../../../../ui/components/BlankState';

import detailCounter from '../queries.gql';

class CounterDetail extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidUpdate(prevProps) {
    const prevId =
      prevProps.data && prevProps.data.detailCounter && prevProps.data.detailCounter._id;
    const { parentFunc, data } = this.props;
    const nowId = data.detailCounter && data.detailCounter._id;

    if (nowId !== prevId) parentFunc(data);
  }

  render() {
    const {
      data,
      component,
      updateDoc,
      removeDoc,
      disabled,
      settings,
      history,
      match,
    } = this.props;

    if (data.loading) return <Loading />;

    if (!data.detailCounter)
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Counter not found!"
          subtitle={`Id: ${match.params._id} is invalid`}
        />
      );

    if (disabled && data.detailCounter.status === 'Draft')
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Please use Edit View!"
          subtitle={`Status is still ${data.detailCounter.status}`}
        />
      );

    if (!(disabled || data.detailCounter.status === 'Draft'))
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Counter cannot be edited anymore!"
          subtitle={`Status is already ${data.detailCounter.status}`}
        />
      );

    return React.createElement(component, {
      disabled,
      doc: data.detailCounter,
      updateDoc,
      removeDoc,
      history,
      settings,
    });
  }
}

CounterDetail.propTypes = {
  data: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  parentFunc: PropTypes.func.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  graphql(detailCounter, {
    options: ({ match }) => ({
      fetchPolicy: 'no-cache',
      variables: {
        _id: match.params._id,
      },
    }),
  }),
)(CounterDetail);
