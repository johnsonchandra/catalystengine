import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';

import Validation from '../../../../../../ui/components/Validation';
import AccountPageFooter from '../../../../../../ui/components/Footer/Page';

import { forgotPassword as forgotPasswordMutation } from '../../../mutations.gql';

import StyledRecoverPassword from './styles';

class UserPasswordRecoverPage extends React.Component {
  handleSubmit = (form) => {
    const email = form.emailAddress.value;

    const { forgotPassword, history } = this.props;

    forgotPassword({
      variables: {
        user: {
          email,
        },
      },
    });
    Bert.alert(`Check ${email} for a verification link!`, 'success');
    history.push('/');
  };

  render() {
    return (
      <StyledRecoverPassword>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Recover Password</h4>
            <Alert bsStyle="info">
              Enter your email address below to receive a link to reset your password.
            </Alert>
            <Validation
              rules={{
                emailAddress: {
                  required: true,
                  email: true,
                },
              }}
              messages={{
                emailAddress: {
                  required: 'Need an email address here.',
                  email: 'Is this email address correct?',
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
                  />
                </FormGroup>
                <Button type="submit" bsStyle="success" block>
                  Recover Password
                </Button>
                <AccountPageFooter>
                  <p>
                    {'Remember your password? '}
                    <Link to="/login">Log In</Link>
                  </p>
                </AccountPageFooter>
              </form>
            </Validation>
          </Col>
        </Row>
      </StyledRecoverPassword>
    );
  }
}

UserPasswordRecoverPage.propTypes = {
  history: PropTypes.object.isRequired,
  forgotPassword: PropTypes.func.isRequired,
};

export default graphql(forgotPasswordMutation, {
  name: 'forgotPassword',
})(UserPasswordRecoverPage);
