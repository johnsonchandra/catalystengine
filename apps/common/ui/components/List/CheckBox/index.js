import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Col,
  ControlLabel,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';

import _ from 'lodash';

import BlankState from '../../BlankState';

const ListCheckBox = ({ parseNameAndValueToJSON, items, disabled }) => {
  const names = _.groupBy(items, 'name');

  return (
    <React.Fragment>
      {items.length > 0 ? (
        Object.keys(names).map((name) => (
          <Row key={name}>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel>{name}</ControlLabel>
                <ListGroup>
                  {names[name].map((item) => (
                    <ListGroupItem key={`${item.name}_${item.value}`}>
                      <Checkbox
                        name="checkboxitem"
                        value={
                          parseNameAndValueToJSON
                            ? JSON.stringify({ name: item.name, value: item.value })
                            : item.value
                        }
                        defaultChecked={item.defaultChecked}
                        inline
                        disabled={disabled}
                      >
                        {_.capitalize(item.value)}
                      </Checkbox>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </FormGroup>
            </Col>
          </Row>
        ))
      ) : (
        <BlankState icon={{ style: 'solid', symbol: 'cogs' }} title="No Data" subtitle="" />
      )}
    </React.Fragment>
  );
};

ListCheckBox.defaultProps = {
  parseNameAndValueToJSON: false,
  items: [],
  disabled: true,
};

ListCheckBox.propTypes = {
  parseNameAndValueToJSON: PropTypes.bool,
  items: PropTypes.array,
  disabled: PropTypes.bool,
};

export default ListCheckBox;
