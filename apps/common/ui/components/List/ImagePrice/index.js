import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ListImagePrice = (props) =>
  props.docs.map((doc) => {
    return (
      <Link key={doc._id} to={doc.linkUrl}>
        <div className="hover-style">
          <img src={doc.logoUrl || Meteor.settings.public.default.logoUrl} alt={doc.name} />
          <div className="shop-title">
            <span>{doc.name}</span>
            <br />
            <span className="new-price">{doc.price}</span>
            <span className="old-price">{doc.priceOld}</span>
          </div>
        </div>
      </Link>
    );
  });

ListImagePrice.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object),
};

ListImagePrice.defaultProps = {
  docs: [],
};

export default ListImagePrice;
