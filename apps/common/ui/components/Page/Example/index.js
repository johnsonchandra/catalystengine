import React from 'react';

import Page from '../index';

import content from './content';

const PageExample = () => (
  <div className="PageExample">
    <Page title="My Example Page" subtitle="A subtitle for my example page." content={content} />
  </div>
);

export default PageExample;
