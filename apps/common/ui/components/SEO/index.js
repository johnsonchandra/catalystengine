import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

const seoURL = (path, host) => (host ? `${host}/${path}` : Meteor.absoluteUrl(path));

const SEO = ({
  schema,
  title,
  description,
  image,
  path,
  host,
  contentType,
  published,
  updated,
  category,
  tags,
  twitter,
}) => (
  <Helmet>
    <html lang="en" itemScope itemType={`http://schema.org/${schema}`} />

    <title>{title}</title>
    <meta name="description" content={description} />
    <meta itemProp="name" content={title} />
    <meta itemProp="description" content={description} />
    <meta itemProp="image" content={image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={twitter} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:creator" content={twitter} />
    <meta name="twitter:image:src" content={image} />

    <meta property="og:title" content={title} />
    <meta property="og:type" content={contentType} />
    <meta property="og:url" content={seoURL(path, host)} />
    <meta property="og:image" content={image} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={title} />

    {published && <meta name="article:published_time" content={published} />}
    {updated && <meta name="article:modified_time" content={updated} />}
    {category && <meta name="article:section" content={category} />}
    {tags && <meta name="article:tag" content={tags} />}
  </Helmet>
);

SEO.defaultProps = {
  host: null,
  schema: 'Product',
  title: 'Catalyst Engine',
  twitter: '@johnson_chandra',
  path: '/',
  updated: null,
  published: null,
  category: null,
  tags: [],
  image: '/mkcb_logo.png',
  description: '',
  contentType: 'website',
};

SEO.propTypes = {
  schema: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  host: PropTypes.string,
  contentType: PropTypes.string,
  published: PropTypes.string,
  updated: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.array,
  twitter: PropTypes.string,
  image: PropTypes.string,
};

export default SEO;
