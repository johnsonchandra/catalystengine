import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Loading from '../../../../../ui/components/Loading';
import Pagination from '../../../../../ui/components/Pagination';

import withTrackerSsr from '../../../../../helpers/withTrackerSsr';

import File from '../../../api';

import getFileJSONdefs from '../../../api/utils/getFileJSONdefs';

class FileDraftList extends React.Component {
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
        <h5>{`${total} File${total > 1 ? 's' : ''}`}</h5>
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

FileDraftList.defaultProps = {
  loading: true,
  docs: [],
  total: 0,
  perPage: 12,
  currentPage: 1,
  onChangePage: () => {},
};
FileDraftList.propTypes = {
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
        createdAt: 1,
      },
    };

    const publishName = 'listFileDraft';
    const subscription = Meteor.subscribe(publishName, options);
    const loading = !subscription.ready();

    const docs = File.find(
      { ...getFileJSONdefs(publishName).query },
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
})(FileDraftList);
