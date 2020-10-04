/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

import ToggleSwitch from '../../../../ui/components/ToggleSwitch';
import BlankState from '../../../../ui/components/BlankState';

import unfreezeApolloCacheValue from '../../../../helpers/unfreezeApolloCacheValue';

import delay from '../../../../helpers/delay';
import Styles from './styles';

class UserSettings extends React.Component {
  state = {
    settings: unfreezeApolloCacheValue(
      this.props.settings && this.props.settings.length > 0 ? [...this.props.settings] : [],
    ),
  };

  handleUpdateSetting = (setting) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const settings = [...this.state.settings];
    const settingToUpdate = settings.find(({ _id }) => _id === setting._id);
    settingToUpdate.value = setting.value;
    settingToUpdate.setByUser = true;

    this.setState({ settings }, () => {
      delay(() => {
        this.props.updateDoc({
          variables: {
            user: {
              _id: this.props.userId,
              settings,
            },
          },
        });
      }, 750);
    });
  };

  renderSettingValue = (type, key, value, onChange) =>
    ({
      boolean: () => (
        <ToggleSwitch
          id={key}
          toggled={value === 'true'}
          onToggle={(id, toggled) => onChange({ key, value: `${toggled}` })}
        />
      ),
      number: () => (
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={(event) => onChange({ key, value: parseInt(event.target.value, 10) })}
        />
      ),
      string: () => (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(event) => onChange({ key, value: event.target.value })}
        />
      ),
    }[type]());

  render() {
    const { settings } = this.state;
    return (
      <div className="UserSettings">
        <ListGroup>
          {settings.length > 0 ? (
            settings.map(({ _id, key, label, type, value }) => (
              <Styles.Setting key={key} className="clearfix">
                <p>{label}</p>
                <div>
                  {this.renderSettingValue(type, key, value, (update) =>
                    this.handleUpdateSetting({ ...update, _id }),
                  )}
                </div>
              </Styles.Setting>
            ))
          ) : (
            <BlankState
              icon={{ style: 'solid', symbol: 'cogs' }}
              title="No settings to manage yet"
              subtitle="When there are settings to manage, they'll appear here"
            />
          )}
        </ListGroup>
      </div>
    );
  }
}

UserSettings.defaultProps = {
  settings: [],
  updateDoc: () => {},
};

UserSettings.propTypes = {
  userId: PropTypes.string.isRequired,
  settings: PropTypes.array,
  updateDoc: PropTypes.func,
};

export default UserSettings;
