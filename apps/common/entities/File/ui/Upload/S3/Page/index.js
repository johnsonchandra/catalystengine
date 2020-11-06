import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap';

import _ from 'lodash';

import roundPercentage from '../../../../../../helpers/roundPercentage';

class FileUploadS3Page extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      progress: '',
    };
  }

  preparingUpload = (file) => {
    const { type, refs } = this.props;
    const metaContext = {
      type,
      refs,
    };

    Bert.alert(`File is uploading..`, 'warning');

    let computation;
    const uploader = new Slingshot.Upload('saveFileToS3', metaContext);
    if (uploader.validate(file)) Bert.alert(`Error uploading..`, 'error');

    uploader.send(file, (error) => {
      computation.stop();

      if (error) {
        Bert.alert(`Error uploading...${error}`, 'danger');
        this.setState({ progress: 'Error' });
      } else {
        this.setState({ progress: '' });
        Bert.alert(`Success uploading..`, 'success');
      }
      const { history } = this.props;
      history.push('/File/draft');
    });

    computation = Tracker.autorun(() => {
      if (!isNaN(uploader.progress())) {
        this.setState({ progress: `${roundPercentage(uploader.progress() * 100, 0)} %` });
      }
    });
  };

  beginFileUpload = (e) => {
    const input = e.target;
    _.each(input.files, (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.preparingUpload(file);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    const { progress } = this.state;

    return (
      <Row>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>Upload</ControlLabel>
            <input onChange={(event) => this.beginFileUpload(event)} type="file" />
            <p>{progress}</p>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

FileUploadS3Page.propTypes = {
  type: PropTypes.string,
  refs: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object.isRequired,
};

FileUploadS3Page.defaultProps = {
  type: 'User',
  refs: [
    {
      _id: Meteor.userId(),
      type: 'User',
    },
  ],
};

export default FileUploadS3Page;
