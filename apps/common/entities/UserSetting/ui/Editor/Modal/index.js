import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';

import { camelCase } from 'lodash';

import Validation from '../../../../../ui/components/Validation';
import InputHint from '../../../../../ui/components/InputHint';
import ToggleSwitch from '../../../../../ui/components/ToggleSwitch';

import delay from '../../../../../helpers/delay';

const defaultState = {
  keyName: '',
  isGDPR: false,
  settingType: 'boolean',
  value: '',
  label: '',
  host: '',
};

class UserSettingEditorModal extends React.Component {
  state = defaultState;

  handleSubmit = (form) => {
    const { setting, updateUserSetting, addUserSetting, onHide } = this.props;
    const { host } = this.state;

    const mutation = setting ? updateUserSetting : addUserSetting;
    const settingNew = {
      isGDPR: this.isGDPR.state.toggled,
      key: form.keyName.value,
      label: form.label.value.trim(),
      type: form.type.value,
      value: form.defaultValue.value,
      host,
    };

    if (setting) {
      settingNew._id = setting._id;
      const confirmUpdate = confirm(
        "Are you sure? This will overwrite this setting for all users immediately. If you're changing the Key Name or Type, double-check that your UI can support this to avoid rendering errors.",
      );
      if (!confirmUpdate) return;
    }

    mutation({
      variables: {
        setting: settingNew,
      },
    });

    onHide();
  };

  handleSetKeyName = (event) => {
    event.persist();
    this.setState({ keyName: event.target.value }, () => {
      delay(() => {
        this.setState({ keyName: camelCase(event.target.value.trim()) });
      }, 300);
    });
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.setting) {
      this.setState({
        keyName: nextProps.setting.key,
        isGDPR: nextProps.setting.isGDPR,
        settingType: nextProps.setting.type,
        value: nextProps.setting.value,
        label: nextProps.setting.label,
        host: nextProps.setting.host,
      });
    } else {
      this.setState(defaultState);
    }
  }

  render() {
    const { show, onHide, setting, userId } = this.props;
    const { keyName, isGDPR, label, settingType, value, host } = this.state;

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>{`${setting ? 'Edit' : 'Add a'} User Setting`}</Modal.Title>
        </Modal.Header>
        <Validation
          rules={{
            keyName: {
              required: true,
            },
            label: {
              required: true,
            },
          }}
          messages={{
            keyName: {
              required: "What's a good keyName for this?",
            },
            label: {
              required: "What's a good label for this?",
            },
          }}
          submitHandler={(form) => {
            this.handleSubmit(form);
          }}
        >
          <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
            <Modal.Body>
              {Roles.userIsInRole(userId, 'admin') && (
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Host</ControlLabel>
                      <input
                        type="text"
                        name="host"
                        className="form-control"
                        value={host}
                        onChange={(event) => this.setState({ host: event.target.value })}
                        placeholder="Host"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <ControlLabel>Key Name</ControlLabel>
                    <input
                      type="text"
                      name="keyName"
                      className="form-control"
                      value={keyName}
                      onChange={this.handleSetKeyName}
                      placeholder="canWeSendYouMarketingEmails"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup>
                    <ControlLabel>Is this a GDPR setting?</ControlLabel>
                    <ToggleSwitch
                      ref={(isGDPRNow) => (this.isGDPR = isGDPRNow)}
                      toggled={isGDPR}
                      onToggle={(id, toggled) => this.setState({ isGDPR: toggled })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <ControlLabel>Label</ControlLabel>
                <input
                  type="text"
                  name="label"
                  className="form-control"
                  value={label}
                  onChange={(event) => this.setState({ label: event.target.value })}
                  placeholder="Can we send you marketing emails?"
                />
                <InputHint>This is what users will see in their settings panel.</InputHint>
              </FormGroup>
              <Row>
                <Col xs={12} sm={6}>
                  <ControlLabel>Type</ControlLabel>
                  <select
                    name="type"
                    value={settingType}
                    onChange={(event) => this.setState({ settingType: event.target.value })}
                    className="form-control"
                  >
                    <option value="boolean">Boolean (true/false)</option>
                    <option value="number">Number</option>
                    <option value="string">String</option>
                  </select>
                </Col>
                <Col xs={12} sm={6}>
                  <ControlLabel>Default Value</ControlLabel>
                  {settingType === 'boolean' && (
                    <select
                      name="defaultValue"
                      value={value}
                      onChange={(event) => this.setState({ value: event.target.value })}
                      className="form-control"
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  )}
                  {settingType === 'number' && (
                    <input
                      type="number"
                      name="defaultValue"
                      className="form-control"
                      value={value}
                      onChange={(event) => {
                        this.setState({ value: parseInt(event.target.value, 10) });
                      }}
                      placeholder={5}
                    />
                  )}
                  {settingType === 'string' && (
                    <input
                      type="text"
                      name="defaultValue"
                      className="form-control"
                      value={value}
                      onChange={(event) => this.setState({ value: event.target.value })}
                      placeholder="Squirrel?!"
                    />
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" bsStyle="success">
                {`${setting ? 'Save' : 'Add'} Setting`}
              </Button>
            </Modal.Footer>
          </form>
        </Validation>
      </Modal>
    );
  }
}

UserSettingEditorModal.defaultProps = {
  setting: null,
};

UserSettingEditorModal.propTypes = {
  userId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  setting: PropTypes.object,
  addUserSetting: PropTypes.func.isRequired,
  updateUserSetting: PropTypes.func.isRequired,
};

export default UserSettingEditorModal;
