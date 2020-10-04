import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { Button, Modal } from 'react-bootstrap';
import { compose, graphql } from 'react-apollo';

import UserSettings from '../../../../entities/User/ui/Settings';

import {
  updateUser as updateUserMutation,
  setUserSettingsByHostToTrue as setUserSettingsByHostToTrueMutation,
} from '../../../../entities/User/ui/mutations.gql';

import Styles from './styles';
import parseDotToUnderscore from '../../../../helpers/parseDotToUnderscore';
import parseHost from '../../../../helpers/parseHost';

class ModalGDPRConsent extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = { show: true };
  }

  handleSaveSettings = () => {
    const { setUserSettingsByHostToTrue } = this.props;
    setUserSettingsByHostToTrue();
  };

  render() {
    const { updateUser, user } = this.props;
    const { show } = this.state;

    const host = parseDotToUnderscore(parseHost(window.location.hostname));

    const settings =
      user &&
      user.hosts &&
      user.hosts[host] &&
      user.hosts[host].settings &&
      user.hosts[host].settings.filter((setting) => setting.isGDPR === true);

    let gdprNotComplete = false;
    if (settings) {
      settings.forEach(({ setByUser }) => {
        if (!setByUser) gdprNotComplete = true;
      });
    }

    return (
      <div className="ModalGDPRConsent">
        <Styles.ModalGDPRConsent
          backdrop="static"
          show={show && gdprNotComplete}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header>
            <h4>GDPR Consent</h4>
          </Modal.Header>
          <Modal.Body>
            <p>
              {"In cooperation with the European Union's (EU) "}
              <a href="https://www.eugdpr.org/" target="_blank" rel="noopener noreferrer">
                General Data Protection Regulation
              </a>
              {
                ' (GDPR), we need to obtain your consent for how we make use of your data. Please review each of the settings below to customize your experience.'
              }
            </p>
            <UserSettings settings={settings} updateDoc={updateUser} userId={user._id} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="success"
              onClick={() => {
                this.handleSaveSettings();
                this.setState({ show: false });
              }}
            >
              Save Settings
            </Button>
          </Modal.Footer>
        </Styles.ModalGDPRConsent>
      </div>
    );
  }
}

ModalGDPRConsent.propTypes = {
  user: PropTypes.object.isRequired,
  setUserSettingsByHostToTrue: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default compose(
  graphql(updateUserMutation, {
    name: 'updateUser',
  }),
  graphql(setUserSettingsByHostToTrueMutation, {
    name: 'setUserSettingsByHostToTrue',
  }),
)(ModalGDPRConsent);
