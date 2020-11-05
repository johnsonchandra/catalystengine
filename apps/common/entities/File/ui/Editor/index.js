import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, FormGroup, Row } from 'react-bootstrap';

import Validation from '../../../../ui/components/Validation';

class FileEditor extends React.Component {
  handleSubmit = (form) => {
    const { doc, updateDoc } = this.props;

    const newDoc = {
      name: form.name.value,
      description: form.description.value,
    };

    if (doc) newDoc._id = doc._id;

    updateDoc(
      {
        variables: {
          inputFile: {
            ...newDoc,
          },
        },
      },
      {
        detailFile: {
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
    if (confirm(`File [ ${name || _id} ] will permanently DELETED!!! ARE YOU SURE???`)) {
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
            type: {
              required: true,
            },
          }}
          messages={{
            name: {
              required: 'Please give File name',
            },
            type: {
              required: 'Please give File type',
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
                      <ControlLabel>Nama File</ControlLabel>
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
                  <Col xs={6} md={6}>
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
                  <Col xs={6} md={6}>
                    <FormGroup>
                      <ControlLabel>Tags</ControlLabel>
                      <input
                        type="text"
                        name="tags"
                        autoComplete="off"
                        className="form-control"
                        defaultValue={doc && doc.tags && doc.tags.join()}
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
                    {doc ? 'Save Changes' : 'Create new File'}
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
              <Col xs={12} md={6}>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>fsUrl</ControlLabel>
                      <input
                        type="text"
                        name="status"
                        className="form-control"
                        defaultValue={doc && doc.fsUrl}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>localUrl</ControlLabel>
                      <input
                        type="text"
                        name="status"
                        className="form-control"
                        defaultValue={doc && doc.localUrl}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>cloudUrl</ControlLabel>
                      <input
                        type="text"
                        name="status"
                        className="form-control"
                        defaultValue={doc && doc.cloudUrl}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={6}>
                    <FormGroup>
                      <ControlLabel>mimeType</ControlLabel>
                      <input
                        type="text"
                        name="status"
                        className="form-control"
                        defaultValue={doc && doc.mimeType}
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
            </Row>
          </form>
        </Validation>
      </React.Fragment>
    );
  }
}

FileEditor.propTypes = {
  doc: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default FileEditor;
