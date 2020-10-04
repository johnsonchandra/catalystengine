import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { StyledListGroup, StyledListGroupItem } from './styles';

const ListGroup = ({ docs }) => (
  <StyledListGroup>
    {docs &&
      docs.map((doc) => (
        <StyledListGroupItem key={doc._id}>
          {doc.linkUrl && <Link to={doc.linkUrl} />}
          <p>
            {doc.title || 'Please input data'}
            <span>{doc.subtitle ? `: ${doc.subtitle}` : ''}</span>
            <br />
            {doc.description}
          </p>
        </StyledListGroupItem>
      ))}
  </StyledListGroup>
);

ListGroup.defaultProps = {
  docs: null,
};

ListGroup.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object),
};

export default ListGroup;
