import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import Loading from '../../../../components/Loading';
import Pagination from '../../../../components/Pagination';

class EntityListProcessingElement extends React.Component {
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

EntityListProcessingElement.defaultProps = {
  loading: true,
  docs: [],
  totals: [],
  total: 0,
  perPage: 12,
  currentPage: 1,
  onChangePage: () => {},
};
EntityListProcessingElement.propTypes = {
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

export default EntityListProcessingElement;
