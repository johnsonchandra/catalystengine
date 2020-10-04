import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import ListCheckBox from '../CheckBox';

class ListRoles extends React.Component {
  handleSubmit = () => {
    const { party: existingParty, updateDoc } = this.props;
    const roleCheckboxes = document.querySelectorAll('[name="checkboxitem"]:checked');
    const roles = [];
    [].forEach.call(roleCheckboxes, (role) => {
      roles.push(role.value);
    });

    const party = {
      _id: existingParty._id,
      roles,
    };

    updateDoc({ variables: { party } });
  };

  render() {
    const { party, disabled } = this.props;
    return (
      <div className="ListRoles">
        <ListCheckBox items={party.roles} disabled={disabled} parseNameAndValueToJSON />
        {!disabled && (
          <Button type="submit" bsStyle="success" onClick={this.handleSubmit}>
            Save
          </Button>
        )}
      </div>
    );
  }
}

ListRoles.defaultProps = {
  party: {},
  disabled: true,
  updateDoc: () => {},
};

ListRoles.propTypes = {
  disabled: PropTypes.bool,
  party: PropTypes.object,
  updateDoc: PropTypes.func,
};

export default ListRoles;
