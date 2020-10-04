import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { timeago } from '../../../../helpers/dates';

import { StyledList, StyledItem } from './styles';

const ListImageRectangle = ({ docs }) => (
  <StyledList>
    {docs.map((doc) => (
      <StyledItem key={doc._id}>
        <Link to={doc.linkUrl || '#'} />
        <header>
          <span className={`${doc.className_span_status_left} pull-left`}>
            {doc.span_status_left}
          </span>
          <span className={`${doc.className_span_status_right} pull-right`}>
            {doc.span_status_right}
          </span>
          <br />
          <span className={`${doc.className_span_status_left_2} pull-left`}>
            {doc.span_status_left_2}
          </span>
          <span className={`${doc.className_span_status_right_2} pull-right`}>
            {doc.span_status_right_2}
          </span>
          <br />
          <img alt={doc.localUrl} src={doc.localUrl} width="100%" />
          <p>{timeago(doc.updatedAt)}</p>
        </header>
      </StyledItem>
    ))}
  </StyledList>
);

ListImageRectangle.defaultProps = {
  docs: [],
};

ListImageRectangle.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object),
};

export default ListImageRectangle;
