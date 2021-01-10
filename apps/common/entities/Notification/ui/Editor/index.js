import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ControlLabel, FormGroup, Row } from 'react-bootstrap';

import Validation from '../../../../ui/components/Validation';

import { iso } from '../../../../helpers/dates';

class NotificationEditor extends React.Component {
  handleSubmit = (form) => {
    const { doc, updateDoc } = this.props;

    const newDoc = {
      nr: form.nr.value,
      name: form.name.value,
      trxDate: form.trxDate.value,
      amount: parseFloat(form.amount.value),
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
    const { doc, disabled, settings } = this.props;

    return (
      <React.Fragment>
        <Validation
          rules={{
            nr: {
              required: true,
            },
            name: {
              required: true,
            },
            trxDate: {
              required: true,
            },
            amount: {
              required: true,
              number: true,
            },
          }}
          messages={{
            nr: {
              required: 'Harap mengisi Nomor Notification',
            },
            name: {
              required: 'Harap mengisi Nama Notification',
            },
            trxDate: {
              required: 'Harap mengisi Tanggal Notification',
            },
            amount: {
              required: 'Harap mengisi Jumlah',
              number: 'Jumlah harus angka',
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
                      <ControlLabel>Nomor Notification</ControlLabel>
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
                      <ControlLabel>Nama Notification</ControlLabel>
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
                      <ControlLabel>Jumlah</ControlLabel>
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        defaultValue={doc && doc.amount}
                        disabled={disabled}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup>
                      <ControlLabel>Tgl. Transaksi</ControlLabel>
                      <input
                        type="datetime-local"
                        name="trxDate"
                        className="form-control"
                        defaultValue={
                          doc &&
                          doc.trxDate &&
                          iso(doc.trxDate, settings.timezone, 'YYYY-MM-DD[T]HH:mm')
                        }
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

NotificationEditor.propTypes = {
  doc: PropTypes.object.isRequired,
  updateDoc: PropTypes.func.isRequired,
  removeDoc: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
};

export default NotificationEditor;
