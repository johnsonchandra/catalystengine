import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { compose, graphql } from 'react-apollo';

import Loading from '../../../../../common/ui/components/Loading';
import BlankState from '../../../../../common/ui/components/BlankState';

import detailDocument from '../queries.gql';

class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidUpdate(prevProps) {
    const prevId =
      prevProps.data && prevProps.data.detailDocument && prevProps.data.detailDocument._id;
    const { parentFunc, data } = this.props;
    const nowId = data.detailDocument && data.detailDocument._id;

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

    if (!data.detailDocument)
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Document not found!"
          subtitle={`Id: ${match.params._id} is invalid`}
        />
      );

    if (disabled && data.detailDocument.status === 'Draft')
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Please use Edit View!"
          subtitle={`Status is still ${data.detailDocument.status}`}
        />
      );

    if (!(disabled || data.detailDocument.status === 'Draft'))
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="Document cannot be edited anymore!"
          subtitle={`Status is already ${data.detailDocument.status}`}
        />
      );

    return React.createElement(component, {
      disabled,
      doc: data.detailDocument,
      updateDoc,
      removeDoc,
      history,
      settings,
    });
  }
}

DocumentDetail.propTypes = {
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
  graphql(detailDocument, {
    options: ({ match }) => ({
      fetchPolicy: 'no-cache',
      variables: {
        _id: match.params._id,
      },
    }),
  }),
)(DocumentDetail);
