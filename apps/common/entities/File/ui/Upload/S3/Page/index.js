import React from 'react';
import PropTypes from 'prop-types';
import FileInput from '../../../../../../ui/components/FileInput';

const FileUploadS3Page = (props) => <FileInput {...props} />;

FileUploadS3Page.propTypes = {
  type: PropTypes.string,
  refs: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object.isRequired,
};

FileUploadS3Page.defaultProps = {
  type: 'User',
  refs: undefined,
};

export default FileUploadS3Page;
