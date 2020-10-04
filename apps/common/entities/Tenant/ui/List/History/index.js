import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Loading from '../../../../../ui/components/Loading';
import Pagination from '../../../../../ui/components/Pagination';
import withTrackerSsr from '../../../../../helpers/withTrackerSsr';

import Tenant from '../../../api';

import getTenantJSONdefs from '../../../api/utils/getTenantJSONdefs';

class TenantHistoryList extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      loading,
      docs,
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
        <h5>{`${total} Tenant${total > 1 ? 's' : ''}`}</h5>
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

TenantHistoryList.defaultProps = {
  loading: true,
  docs: [],
  total: 0,
  perPage: 12,
  currentPage: 1,
  onChangePage: () => {},
};
TenantHistoryList.propTypes = {
  loading: PropTypes.bool,
  docs: PropTypes.arrayOf(PropTypes.object),
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
        nr: 1,
      },
    };

    const publishName = 'listTenantHistory';
    const subscription = Meteor.subscribe(publishName, options);
    const loading = !subscription.ready();

    const docs = Tenant.find(
      { ...getTenantJSONdefs(publishName).query },
      {
        sort: options.sort,
      },
    ).fetch();

    const total = Counts.get(`${publishName}Count`);

    params = {
      ...params,
      loading,
      docs,
      total,
    };
  }
  return params;
})(TenantHistoryList);
