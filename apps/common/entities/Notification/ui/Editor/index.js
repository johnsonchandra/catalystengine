import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, FormGroup, Row } from 'react-bootstrap';

import Validation from '../../../../ui/components/Validation';

// FIXME from and to not yet selectable
class NotificationEditor extends React.Component {
  handleSubmit = (form) => {
    const { doc, updateDoc } = this.props;

    const newDoc = {
      name: form.name.value,
      fromName: form.fromName.value, // FIXME both from and to should send _id instead of name
      toName: form.toName.value,
      type: form.type.value,
      description: form.description.value,
    };

    if (doc) newDoc._id = doc._id;

    updateDoc(
      {
        variables: {
          inputNotification: {
            ...newDoc,
          },
        },
      },
      {
        detailNotification: {
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
    if (confirm(`Notification [ ${name || _id} ] will permanently DELETED!!! ARE YOU SURE???`)) {
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
            name: {
              required: true,
            },
          }}
          messages={{
            name: {
              required: 'Harap mengisi Nama Notification',
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
                      <ControlLabel>Notification Name</ControlLabel>
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
                      <ControlLabel>From</ControlLabel>
                      <input
                        type="text"
                        name="fromName"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.from && doc.from.name}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup>
                      <ControlLabel>To</ControlLabel>
                      <input
                        type="text"
                        name="toName"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.to && doc.to.name}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={6}>
                    <FormGroup>
                      <ControlLabel>Type</ControlLabel>
                      <select
                        className="form-control"
                        name="type"
                        defaultValue={doc && doc.type}
                        disabled={disabled}
                      >
                        {['Info', 'Error'].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
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
                  {doc ? 'Save Changes' : 'Create new Notification'}
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
            </Row>
          </form>
        </Validation>
      </React.Fragment>
    );
  }
}

NotificationEditor.propTypes = {
  doc: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default NotificationEditor;
