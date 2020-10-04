import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import _ from 'lodash';

import { iso } from '../../../../helpers/dates';

import { StyledList, StyledItem } from './styles';

const ListRectangle = ({ docs, onClick }) => (
  <StyledList>
    {docs.map((doc) => (
      <StyledItem key={doc._id} onClick={() => onClick(doc)}>
        <Link to={(_.isEmpty(onClick) && doc.linkUrl) || '#'} />
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
          <span className={`${doc.className_span_status_left_3} pull-left`}>
            {doc.span_status_left_3}
          </span>
          <span className={`${doc.className_span_status_right_3} pull-right`}>
            {doc.span_status_right_3}
          </span>
          <br />
          <h2>{doc.subtitle}</h2>
          <h3>{doc.title}</h3>
          <p>{doc.description}</p>
          {doc.updatedAt && (
            <span className="label label-success pull-left">
              {iso(parseInt(doc.updatedAt, 10), 'Asia/Jakarta', 'DD/MM/YYYY HH:mm:ss')}
            </span>
          )}
        </header>
      </StyledItem>
    ))}
  </StyledList>
);

ListRectangle.defaultProps = {
  docs: [],
  onClick: () => {},
};

ListRectangle.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
};

export default ListRectangle;
