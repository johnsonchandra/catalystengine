import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, FormGroup, Row } from 'react-bootstrap';

import Validation from '../../../../ui/components/Validation';

class OrgEditor extends React.Component {
  handleSubmit = (form) => {
    const { doc, updateDoc } = this.props;

    const newDoc = {
      nr: form.nr.value,
      name: form.name.value,
      shortname: form.shortname.value,
      phone: form.phone.value,
      type: form.type.value,
      description: form.description.value,
    };

    if (doc) newDoc._id = doc._id;

    updateDoc(
      {
        variables: {
          inputOrg: {
            ...newDoc,
          },
        },
      },
      {
        detailOrg: {
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
    if (confirm(`Document [ ${name || _id} ] will permanently DELETED!!! ARE YOU SURE???`)) {
      removeDoc({
        variables: {
          _id,
        },
      });
    }
  };

  render() {
    const { doc, disabled, settings } = this.props;

    return (
      <React.Fragment>
        <Validation
          rules={{
            name: {
              required: true,
            },
            phone: {
              required: true,
            },
            type: {
              required: true,
            },
          }}
          messages={{
            name: {
              required: 'Please fill Organization Name',
            },
            phone: {
              required: 'Please fill Phone number',
            },
            type: {
              required: 'Please fill type of Organization',
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
                      <ControlLabel>Org Nr</ControlLabel>
                      <input
                        type="text"
                        name="nr"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.nr}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Org Name</ControlLabel>
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
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Short Name</ControlLabel>
                      <input
                        type="text"
                        name="shortname"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.shortname}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={6}>
                    <FormGroup>
                      <ControlLabel>Phone</ControlLabel>
                      <input
                        type="text"
                        name="phone"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.phone}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={6} md={6}>
                    <FormGroup>
                      <ControlLabel>Type</ControlLabel>
                      <select
                        className="form-control"
                        name="type"
                        defaultValue={doc && doc.type}
                        disabled={disabled}
                      >
                        {settings.orgTypes.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
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
                    {doc ? 'Save Changes' : 'Create new Org'}
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

OrgEditor.propTypes = {
  doc: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
};

export default OrgEditor;
