import React from 'react';
import PropTypes from 'prop-types';

import Styles from './styles';

const FooterPage = ({ children }) => <Styles.FooterPage>{children}</Styles.FooterPage>;

FooterPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FooterPage;
