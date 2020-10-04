import { Random } from 'meteor/random';

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, ControlLabel, FormGroup, Checkbox, InputGroup, Button } from 'react-bootstrap';

import InputHint from '../../../../ui/components/InputHint';
import Icon from '../../../../ui/components/Icon';
import Validation from '../../../../ui/components/Validation';

class UserDetail extends React.Component {
  state = { showPassword: false, password: '' };

  handleSubmit = (form) => {
    const { user: existingUser, updateDoc } = this.props;
    const isPasswordUser = existingUser && !existingUser.oAuthProvider;
    const password = isPasswordUser ? form.password.value : null;

    let user;

    if (isPasswordUser) {
      user = {
        email: form.emailAddress.value,
        password,
        profile: {
          fullname: form.fullname.value,
          shortname: form.shortname.value,
          phone: form.phone.value,
        },
      };
    }

    if (existingUser) user._id = existingUser._id;
    updateDoc({ variables: { user } }, () => this.setState({ password: '' }));
  };

  generatePassword = () => {
    this.setState({ password: Random.hexString(20) });
  };

  render() {
    const { user } = this.props;
    const { showPassword, password } = this.state;

    return (
      <div className="UserDetail">
        <Validation
          rules={{
            fullname: {
              required: true,
            },
            shortname: {
              required: true,
            },
            emailAddress: {
              required: true,
              email: true,
            },
            password: {
              minlength: 6,
            },
          }}
          messages={{
            fullname: {
              required: "What's the user's full name?",
            },
            shortname: {
              required: "What's the user's nick name?",
            },
            emailAddress: {
              required: 'Need an email address here.',
              email: 'Is this email address correct?',
            },
            password: {
              minlength: 'Please use at least six characters.',
            },
          }}
          submitHandler={(form) => this.handleSubmit(form)}
        >
          <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
            {user && (
              <Row>
                <Col xs={12} md={6}>
                  {user && user.fullname && (
                    <Row>
                      <Col xs={6}>
                        <FormGroup>
                          <ControlLabel>Full Name</ControlLabel>
                          <input
                            disabled={user && user.oAuthProvider}
                            type="text"
                            name="fullname"
                            className="form-control"
                            defaultValue={user && user.fullname}
                          />
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup>
                          <ControlLabel>Short Name</ControlLabel>
                          <input
                            disabled={user && user.oAuthProvider}
                            type="text"
                            name="shortname"
                            className="form-control"
                            defaultValue={user && user.shortname}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  {user && user.username && (
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <ControlLabel>Username</ControlLabel>
                          <input
                            disabled={user && user.oAuthProvider}
                            type="text"
                            name="username"
                            className="form-control"
                            defaultValue={user && user.username}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Email Address</ControlLabel>
                        <input
                          disabled={user && user.oAuthProvider}
                          type="text"
                          name="emailAddress"
                          autoComplete="off"
                          className="form-control"
                          defaultValue={user && user.emailAddress}
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
                          defaultValue={user.phone}
                          className="form-control"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {user && !user.oAuthProvider && (
                    <Row>
                      <Col xs={12}>
                        <FormGroup>
                          <ControlLabel>
                            Password
                            <Checkbox
                              inline
                              checked={showPassword}
                              className="pull-right"
                              onChange={() =>
                                this.setState({
                                  showPassword: !showPassword,
                                })
                              }
                            >
                              Show Password
                            </Checkbox>
                          </ControlLabel>
                          <InputGroup>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              className="form-control"
                              autoComplete="off"
                              value={password}
                              onChange={(event) => {
                                this.setState({ password: event.target.value });
                              }}
                            />
                            <InputGroup.Button>
                              <Button onClick={this.generatePassword}>
                                <Icon iconStyle="solid" icon="refresh" />
                                {' Generate'}
                              </Button>
                            </InputGroup.Button>
                          </InputGroup>
                          <InputHint>Use at least six characters.</InputHint>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Button type="submit" bsStyle="success">
                    {user ? 'Save Changes' : 'Create User'}
                  </Button>
                </Col>
              </Row>
            )}
          </form>
        </Validation>
      </div>
    );
  }
}

UserDetail.propTypes = {
  user: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
};

export default UserDetail;
