import React from 'react';
import PropTypes from 'prop-types';
import FileInput from '../../../../../../ui/components/FileInput';

const FileUploadS3Page = (props) => <FileInput {...props} />;

FileUploadS3Page.propTypes = {
  type: PropTypes.string,
  typeId: PropTypes.string,
  refs: PropTypes.arrayOf(PropTypes.object),
  routeAfter: PropTypes.string,
  history: PropTypes.object.isRequired,
};

FileUploadS3Page.defaultProps = {
  type: 'User',
  typeId: undefined,
  refs: undefined,
  routeAfter: undefined,
};

export default FileUploadS3Page;
