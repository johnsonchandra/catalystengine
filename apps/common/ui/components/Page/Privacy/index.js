import React from 'react';

import Page from '../index';

import content from './content';

const PrivacyPage = () => (
  <div className="PrivacyPage">
    <Page title="PrivacyPage Policy" subtitle="Last updated March 30th, 2020" content={content} />
  </div>
);

export default PrivacyPage;
