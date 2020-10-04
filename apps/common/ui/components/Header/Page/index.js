import React from 'react';
import PropTypes from 'prop-types';

import Styles from './styles';

const HeaderPage = ({ title, subtitle }) => (
  <Styles.HeaderPage>
    <Styles.HeaderPageContainer>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </Styles.HeaderPageContainer>
  </Styles.HeaderPage>
);

HeaderPage.defaultProps = {
  subtitle: '',
};

HeaderPage.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default HeaderPage;
