import { Bert } from 'meteor/themeteorchef:bert';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import _ from 'lodash';

import Styles from './styles';

import roundPercentage from '../../../helpers/roundPercentage';

// FIXME right now still only to S3, please modify in settings to enable softcode FS/S3
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      progress: '',
    };
  }

  preparingUpload = (file) => {
    const { type, typeId, refs } = this.props;
    const metaContext = {
      type,
      typeId,
      refs,
    };

    Bert.alert(`File is uploading..`, 'warning');

    let computation;
    const uploader = new Slingshot.Upload('saveFileToS3', metaContext);
    if (uploader.validate(file)) Bert.alert(`Error uploading..`, 'error');

    uploader.send(file, (error, response) => {
      computation.stop();

      if (error) {
        Bert.alert(`Error uploading...${error}`, 'danger');
        this.setState({ progress: 'Error' });
      } else {
        this.setState({ progress: '' });
        Bert.alert(`Success uploading..`, 'success');

        const { history, routeAfter } = this.props;

        history.push(
          routeAfter || `/File/${response.substring(response.lastIndexOf('/') + 1)}/edit`,
        );
      }
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
      <Styles.FileInput className="FileInput">
        <input onChange={(event) => this.beginFileUpload(event)} type="file" />
        <p>{progress}</p>
      </Styles.FileInput>
    );
  }
}

FileInput.propTypes = {
  type: PropTypes.string,
  typeId: PropTypes.string,
  refs: PropTypes.arrayOf(PropTypes.object),
  routeAfter: PropTypes.string,
  history: PropTypes.object.isRequired,
};

FileInput.defaultProps = {
  type: 'User',
  typeId: undefined,
  refs: undefined,
  routeAfter: undefined,
};

export default FileInput;
