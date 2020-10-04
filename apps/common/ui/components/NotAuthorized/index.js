import React from 'react';
import { Alert } from 'react-bootstrap';

const NotAuthorized = () => (
  <div className="NotAuthorized">
    <Alert bsStyle="danger">
      <p>
        <strong>You are not authorized to access the page</strong>
      </p>
    </Alert>
  </div>
);

export default NotAuthorized;
