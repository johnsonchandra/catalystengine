import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import _ from 'lodash';

class FileUploadFSPage extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  state = {
    uploaded: '',
  };

  beginFileUpload = (e) => {
    const input = e.target;
    _.each(input.files, (file) => {
      const fileReader = new FileReader();
      const { name, type, size } = file;
      fileReader.onload = () => {
        let binary = fileReader.result;
        if (!fileReader.readAsBinaryString) {
          const bytes = new Uint8Array(fileReader.result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i += 1) {
            binary += String.fromCharCode(bytes[i]);
          }
        }
        Meteor.call('saveFileToFS', binary, name, type, size);
      };
      fileReader.onloadend = () => {
        const { history } = this.props;
        this.setState({
          uploaded: 'Finish...',
        });
        history.push('/File');
      };
      fileReader.onloadstart = () => {
        this.setState({
          uploaded: 'Starting...',
        });
      };
      fileReader.onprogress = (event) => {
        const uploaded = Math.round((event.loaded / event.total) * 100);
        this.setState({
          uploaded: `${uploaded < 99 ? uploaded : 99} %`,
        });
      };
      fileReader.onabort = () => {
        this.setState({
          uploaded: 'Aborted...',
        });
      };
      fileReader.onerror = () => {
        this.setState({
          uploaded: 'Error...',
        });
      };

      fileReader.onerror = fileReader.onerror.bind(this);
      fileReader.onabort = fileReader.onabort.bind(this);
      fileReader.onloadstart = fileReader.onloadstart.bind(this);
      fileReader.onloadend = fileReader.onloadend.bind(this);
      fileReader.onprogress = fileReader.onprogress.bind(this);

      if (fileReader.readAsBinaryString) {
        fileReader.readAsBinaryString(file);
      } else {
        fileReader.readAsArrayBuffer(file);
      }
    });
  };

  render() {
    const { uploaded } = this.state;
    return (
      <React.Fragment>
        <form>
          <input
            type="file"
            onChange={(event) => {
              this.beginFileUpload(event);
            }}
          />
          <p>
            Connnection Status:
            {Meteor.status().status}
          </p>
          <p>
            Upload Status:
            {uploaded}
          </p>
        </form>
      </React.Fragment>
    );
  }
}

FileUploadFSPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default FileUploadFSPage;
