import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

import Validation from '../../../../../ui/components/Validation';
import FooterPage from '../../../../../ui/components/Footer/Page';

import { StyledLogin, LoginPromo } from './styles';

class UserLoginPage extends React.Component {
  handleSubmit = (form) => {
    Meteor.loginWithPassword(form.emailAddress.value, form.password.value, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Welcome back!', 'success');
      }
    });
  };

  render() {
    const { settings } = this.props;

    return (
      <StyledLogin>
        <LoginPromo>
          <header>
            <img src={settings.logo} alt={settings.shortname} />
            <h4>{`${settings.productname} for ${settings.shortname}`}</h4>
            <p>{settings.description}</p>
          </header>
        </LoginPromo>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Log In</h4>
            <Validation
              rules={{
                emailAddress: {
                  required: true,
                  email: true,
                },
                password: {
                  required: true,
                },
              }}
              messages={{
                emailAddress: {
                  required: 'Need an email address here.',
                  email: 'Is this email address correct?',
                },
                password: {
                  required: 'Need a password here.',
                },
              }}
              submitHandler={(form) => {
                this.handleSubmit(form);
              }}
            >
              <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
                <FormGroup>
                  <ControlLabel>Email Address</ControlLabel>
                  <input
                    type="email"
                    name="emailAddress"
                    className="form-control"
                    placeholder="Email Address"
                    data-test="emailAddress"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="clearfix">
                    <span className="pull-left">Password</span>
                    <Link className="pull-right" to="/recover-password">
                      Forgot password?
                    </Link>
                  </ControlLabel>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    data-test="password"
                  />
                </FormGroup>
                <Button type="submit" bsStyle="success" block>
                  Log In
                </Button>
                <FooterPage>
                  <p>
                    {"Don't have an account? "}
                    <Link to="/signup">Sign Up</Link>
                  </p>
                </FooterPage>
              </form>
            </Validation>
          </Col>
        </Row>
      </StyledLogin>
    );
  }
}

UserLoginPage.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default UserLoginPage;
