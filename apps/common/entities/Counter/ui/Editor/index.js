import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, FormGroup, Row } from 'react-bootstrap';

import Validation from '../../../../ui/components/Validation';

class CounterEditor extends React.Component {
  handleSubmit = (form) => {
    const { doc, updateDoc } = this.props;

    const newDoc = {
      name: form.name.value,
      counter: parseInt(form.counter.value, 10),
      type: form.type.value,
      description: form.description.value,
    };

    if (doc) newDoc._id = doc._id;

    updateDoc(
      {
        variables: {
          inputCounter: {
            ...newDoc,
          },
        },
      },
      {
        detailCounter: {
          ...doc,
          ...newDoc,
        },
      },
    );
  };

  handleRemoveDoc = () => {
    // eslint-disable-next-line react/destructuring-assignment
    const { doc, removeDoc } = this.props;
    const { _id, name } = doc;
    if (confirm(`Counter [ ${name || _id} ] will permanently DELETED!!! ARE YOU SURE???`)) {
      removeDoc({
        variables: {
          _id,
        },
      });
    }
  };

  render() {
    const { doc, disabled } = this.props;

    return (
      <React.Fragment>
        <Validation
          rules={{
            type: {
              required: true,
            },
            counter: {
              required: true,
              number: true,
            },
          }}
          messages={{
            type: {
              required: 'Please input type of Counter',
            },
            counter: {
              required: 'Please input start counter in integer',
              number: 'start counter must be in integer',
            },
          }}
          submitHandler={(form) => this.handleSubmit(form)}
        >
          <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
            <Row>
              <Col xs={12} md={6}>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Counter Name</ControlLabel>
                      <input
                        type="text"
                        name="name"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.name}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <FormGroup>
                      <ControlLabel>Counter start</ControlLabel>
                      <input
                        type="number"
                        name="counter"
                        className="form-control"
                        defaultValue={doc && doc.counter}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup>
                      <ControlLabel>Type</ControlLabel>
                      <input
                        type="text"
                        name="type"
                        className="form-control"
                        defaultValue={doc && doc.type}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Description</ControlLabel>
                      <textarea
                        rows={3}
                        name="description"
                        className="form-control"
                        defaultValue={doc && doc.description}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {!disabled ? (
                  <Button type="submit" bsStyle="success">
                    {doc ? 'Save Changes' : 'Create new Counter'}
                  </Button>
                ) : (
                  <div />
                )}
                {!disabled && doc && (
                  <Button bsStyle="danger" className="pull-right" onClick={this.handleRemoveDoc}>
                    Delete
                  </Button>
                )}
                <hr />
              </Col>
              {doc.status !== 'Draft' && (
                <Col xs={12} md={6}>
                  <Row>
                    <Col xs={6} md={6}>
                      <FormGroup>
                        <ControlLabel>Type</ControlLabel>
                        <input
                          type="text"
                          name="type"
                          className="form-control"
                          defaultValue={doc && doc.type}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={6} md={6}>
                      <FormGroup>
                        <ControlLabel>Status</ControlLabel>
                        <input
                          type="text"
                          name="status"
                          className="form-control"
                          defaultValue={doc && doc.status}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </form>
        </Validation>
      </React.Fragment>
    );
  }
}

CounterEditor.propTypes = {
  doc: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default CounterEditor;
