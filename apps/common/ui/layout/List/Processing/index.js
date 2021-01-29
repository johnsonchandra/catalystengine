import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import withTrackerSsr from '../../../../helpers/withTrackerSsr';

import Counter from '../../../../entities/Counter/api';
import File from '../../../../entities/File/api';
import Notification from '../../../../entities/Notification/api';

class ListProcessing extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      loading,
      docs,
      totals,
      total,
      perPage,
      currentPage,
      onChangePage,
      settings,
      component,
      parser,
    } = this.props;

    if (loading) return <Loading />;

    return (
      <React.Fragment>
        {React.createElement(component, {
          docs: parser(docs, settings),
          caption: `Last Updated: ${new Date().toLocaleString()}`,
        })}
        {totals.map((totalEntity) => (
          <h5 key={totalEntity.entityName}>
            {`${totalEntity.entityName}: ${totalEntity.total} Processing${
              totalEntity.total > 1 ? 's' : ''
            }`}
          </h5>
        ))}
        <h5>{`${total} Processing${total > 1 ? 's' : ''}`}</h5>
        {total && total > perPage ? (
          <Pagination
            currentPage={currentPage}
            onChangePage={onChangePage}
            perPage={perPage}
            total={total}
          />
        ) : (
          <div />
        )}
      </React.Fragment>
    );
  }
}

ListProcessing.defaultProps = {
  loading: true,
  docs: [],
  totals: [],
  total: 0,
  perPage: 12,
  currentPage: 1,
  onChangePage: () => {},
};
ListProcessing.propTypes = {
  loading: PropTypes.bool,
  docs: PropTypes.arrayOf(PropTypes.object),
  totals: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
  perPage: PropTypes.number,
  currentPage: PropTypes.number,
  onChangePage: PropTypes.func,
  settings: PropTypes.object.isRequired,
  parser: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
};

export default withTrackerSsr((props) => {
  let params = { ...props };

  if (Meteor.isClient) {
    const options = {
      search: props.search,
      perPage: props.perPage,
      currentPage: props.currentPage,
      sort: {
        updatedAt: 1,
      },
    };

    const Entities = [
      { name: 'Counter', Entity: Counter },
      { name: 'File', Entity: File },
      { name: 'Notification', Entity: Notification },
    ];
    const subscriptions = Entities.map((entity) =>
      Meteor.subscribe(`list${entity.name}Processing`, options),
    );

    let loading = true;
    subscriptions.forEach((subscription, index) => {
      loading = index === 0 ? !subscription.ready() : loading || !subscription.ready();
    });

    let docs = [];
    Entities.forEach((entity) => {
      const entityDocs = entity.Entity.find(
        { status: 'Processing' },
        {
          sort: options.sort,
        },
      )
        .fetch()
        .map((entityDoc) => {
          return {
            entityName: entity.name,
            ...entityDoc,
          };
        });
      docs = docs.concat(entityDocs);
    });

    let total = 0;
    const totals = Entities.map((entity) => {
      const entityTotal = Counts.get(`list${entity.name}ProcessingCount`);
      total += entityTotal;
      return {
        entityName: entity.name,
        total: entityTotal,
      };
    });

    params = {
      ...params,
      loading,
      docs,
      totals,
      total,
    };
  }
  return params;
})(ListProcessing);
