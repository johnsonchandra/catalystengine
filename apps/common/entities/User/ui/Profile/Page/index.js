import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql, withApollo } from 'react-apollo';
import { Button, Col, ControlLabel, FormGroup, Row, Tab, Tabs } from 'react-bootstrap';

import FileSaver from 'file-saver';
import base64ToBlob from 'b64-to-blob';

import Validation from '../../../../../ui/components/Validation';
import InputHint from '../../../../../ui/components/InputHint';
import FooterPage from '../../../../../ui/components/Footer/Page';
import BlankState from '../../../../../ui/components/BlankState';
import Loading from '../../../../../ui/components/Loading';

import { detailUser, exportUserData } from '../../queries.gql';

import { updateUser as updateUserMutation } from '../../mutations.gql';

import UserSettings from '../../Settings';
import ListRoles from '../../../../../ui/components/List/Roles';

import Styles from './styles';

class UserProfilePage extends React.Component {
  state = { activeTab: 'profile' };

  handleExportData = async (event) => {
    const { client } = this.props;
    event.preventDefault();
    const { data } = await client.query({
      query: exportUserData,
    });

    FileSaver.saveAs(base64ToBlob(data.exportUserData.zip), `${Meteor.userId()}.zip`);
  };

  handleSubmit = (form) => {
    const { updateUser, data } = this.props;
    updateUser({
      variables: {
        user: {
          _id: data.detailUser._id,
          email: form.emailAddress.value,
          profile: {
            fullname: form.fullname.value,
            shortname: form.shortname.value,
            phone: form.phone.value,
          },
        },
      },
    });

    if (form.newPassword.value) {
      Accounts.changePassword(form.currentPassword.value, form.newPassword.value, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          form.currentPassword.value = ''; // eslint-disable-line no-param-reassign
          form.newPassword.value = ''; // eslint-disable-line no-param-reassign
        }
      });
    }
  };

  renderPasswordUser = (member) => (
    <div>
      <Row>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>Full Name</ControlLabel>
            <input
              type="text"
              name="fullname"
              defaultValue={member.fullname}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>Short Name</ControlLabel>
            <input
              type="text"
              name="shortname"
              defaultValue={member.shortname}
              className="form-control"
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
              defaultValue={member.emailAddress}
              className="form-control"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>Phone</ControlLabel>
            <input type="text" name="phone" defaultValue={member.phone} className="form-control" />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>Current Password</ControlLabel>
            <input type="password" name="currentPassword" className="form-control" />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>New Password</ControlLabel>
            <input type="password" name="newPassword" className="form-control" />
            <InputHint>Use at least six characters.</InputHint>
          </FormGroup>
        </Col>
      </Row>
      <Button type="submit" bsStyle="success">
        Save Profile
      </Button>
    </div>
  );

  render() {
    const { data, updateUser } = this.props;
    const { activeTab } = this.state;

    if (data.loading) return <Loading />;
    if (!data.detailUser)
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'cogs' }}
          title="No Profile found"
          subtitle=""
        />
      );

    return (
      <Styles.UserProfile>
        <Tabs
          animation={false}
          activeKey={activeTab}
          onSelect={(activeTabNow) => this.setState({ activeTab: activeTabNow })}
          id="admin-user-tabs"
        >
          <Tab eventKey="profile" title="Profile">
            <Row>
              <Col xs={12} sm={6} md={4}>
                <Validation
                  rules={{
                    fullname: {
                      required: true,
                    },
                    shortname: {
                      required: true,
                    },
                    phone: {
                      required: true,
                      mobilephoneID: true,
                    },
                    emailAddress: {
                      required: true,
                      email: true,
                    },
                    currentPassword: {
                      required: () =>
                        // Only required if newPassword field has a value.
                        document.querySelector('[name="newPassword"]').value.length > 0,
                    },
                    newPassword: {
                      required() {
                        // Only required if currentPassword field has a value.
                        return document.querySelector('[name="currentPassword"]').value.length > 0;
                      },
                      minlength: 6,
                    },
                  }}
                  messages={{
                    fullname: {
                      required: "What's your full name?",
                    },
                    shortname: {
                      required: "What's your nick name?",
                    },
                    phone: {
                      required: "What's your phone number?",
                      mobilephoneID: 'Please input valid Indonesian mobile phone number',
                    },
                    emailAddress: {
                      required: 'Need an email address here.',
                      email: 'Is this email address correct?',
                    },
                    currentPassword: {
                      required: 'Need your current password if changing.',
                    },
                    newPassword: {
                      required: 'Need your new password if changing.',
                    },
                  }}
                  submitHandler={(form) => this.handleSubmit(form)}
                >
                  <form
                    ref={(form) => (this.form = form)}
                    onSubmit={(event) => event.preventDefault()}
                  >
                    {this.renderPasswordUser(data.detailUser)}
                  </form>
                </Validation>
                <FooterPage>
                  <p>
                    <Button bsStyle="link" className="btn-export" onClick={this.handleExportData}>
                      Export my data
                    </Button>
                    {' - '}
                    Download all of your documents as .txt files in a .zip
                  </p>
                </FooterPage>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="roles" title="Roles">
            <ListRoles party={data.detailUser} disabled />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <UserSettings
              userId={data.detailUser._id}
              settings={data.detailUser.settings}
              updateDoc={updateUser}
            />
          </Tab>
        </Tabs>
      </Styles.UserProfile>
    );
  }
}

UserProfilePage.propTypes = {
  data: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

export default compose(
  graphql(detailUser, {
    options: ({ match }) => ({
      fetchPolicy: 'no-cache',
      variables: {
        _id: match.params._id,
      },
    }),
  }),
  graphql(updateUserMutation, {
    name: 'updateUser',
    options: () => ({
      refetchQueries: [{ query: detailUser }],
      onCompleted: () => {
        Bert.alert('Profile updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(withApollo(UserProfilePage));
