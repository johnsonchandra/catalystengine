import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';

import Validation from '../../../../../ui/components/Validation';
import InputHint from '../../../../../ui/components/InputHint';
import AccountPageFooter from '../../../../../ui/components/Footer/Page';

import parseHost from '../../../../../helpers/parseHost';

import StyledSignup from './styles';

import { sendVerificationEmail as sendVerificationEmailMutation } from '../../mutations.gql';

class UserSignup extends React.Component {
  handleSubmit = (form) => {
    const { history, sendVerificationEmail } = this.props;

    const splitfullname = form.fullname.value.split(' ');

    Accounts.createUser(
      {
        email: form.emailAddress.value,
        password: form.password.value,
        profile: {
          fullname: form.fullname.value,
          shortname: splitfullname[0].trim(),
          phone: form.phone.value,
        },
        host: parseHost(window.location.hostname),
      },
      (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          sendVerificationEmail();
          Bert.alert('Welcome!', 'success');
          history.push('/');
        }
      },
    );
  };

  render() {
    return (
      <StyledSignup>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Sign Up</h4>
            <Validation
              rules={{
                fullname: {
                  required: true,
                },
                emailAddress: {
                  required: true,
                  email: true,
                },
                phone: {
                  required: true,
                },
                password: {
                  required: true,
                  minlength: 6,
                },
              }}
              messages={{
                fullname: {
                  required: "What's your full name?",
                },
                phone: {
                  required: "What's your phone number?",
                },
                emailAddress: {
                  required: 'Need an email address here.',
                  email: 'Is this email address correct?',
                },
                password: {
                  required: 'Need a password here.',
                  minlength: 'Please use at least six characters.',
                },
              }}
              submitHandler={(form) => {
                this.handleSubmit(form);
              }}
            >
              <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Full Name</ControlLabel>
                      <input
                        type="text"
                        name="fullname"
                        className="form-control"
                        placeholder="Full Name"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Email Address</ControlLabel>
                      <input
                        type="email"
                        name="emailAddress"
                        className="form-control"
                        placeholder="Email Address"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Phone</ControlLabel>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Password</ControlLabel>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                      />
                      <InputHint>Use at least six characters.</InputHint>
                    </FormGroup>
                  </Col>
                </Row>
                <Button type="submit" bsStyle="success" block>
                  Sign Up
                </Button>
                <AccountPageFooter>
                  <p>
                    Already have an account?
                    <Link to="/login">{' Log In'}</Link>
                  </p>
                </AccountPageFooter>
              </form>
            </Validation>
          </Col>
        </Row>
      </StyledSignup>
    );
  }
}

UserSignup.propTypes = {
  history: PropTypes.object.isRequired,
  sendVerificationEmail: PropTypes.func.isRequired,
};

export default graphql(sendVerificationEmailMutation, {
  name: 'sendVerificationEmail',
})(UserSignup);
