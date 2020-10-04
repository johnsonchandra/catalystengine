import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import { year } from '../../../../helpers/dates';

import Styles from './styles';

const { productName, copyrightStartYear } = Meteor.settings.public;

const copyrightYear = () => {
  const currentYear = year();
  return currentYear === copyrightStartYear
    ? copyrightStartYear
    : `${copyrightStartYear}-${currentYear}`;
};

const FooterApp = () => (
  <Styles.FooterApp>
    <Grid>
      <p className="pull-left">
        &copy;
        {` ${copyrightYear()} ${productName}`}
      </p>
      <ul className="pull-right">
        <li>
          <Link to="/example-page">
            Example
            <span className="hidden-xs"> Page</span>
          </Link>
        </li>
        <li>
          <Link to="/terms">
            Terms
            <span className="hidden-xs"> of Service</span>
          </Link>
        </li>
        <li>
          <Link to="/privacy">
            Privacy
            <span className="hidden-xs"> Policy</span>
          </Link>
        </li>
      </ul>
    </Grid>
  </Styles.FooterApp>
);

FooterApp.propTypes = {};

export default FooterApp;
