import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

const SEO = ({
  schema,
  title,
  description,
  image,
  url,
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
    <meta name="twitter:site" content={`@${twitter || '@johnson_chandra'}`} />
    <meta name="twitter:title" content={title || 'Catalyst Engine'} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:creator" content={`@${twitter || '@johnson_chandra'}`} />
    <meta name="twitter:image:src" content={image} />

    <meta property="og:title" content={title || 'Catalyst Engine'} />
    <meta property="og:type" content={contentType} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={title || 'Catalyst Engine'} />

    {published && <meta name="article:published_time" content={published} />}
    {updated && <meta name="article:modified_time" content={updated} />}
    {category && <meta name="article:section" content={category} />}
    {tags && <meta name="article:tag" content={tags} />}
  </Helmet>
);

SEO.defaultProps = {
  schema: null,
  url: null,
  updated: null,
  category: null,
  tags: [],
  twitter: null,
  image: '/mkcb_logo.png',
};

SEO.propTypes = {
  schema: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  updated: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.array,
  twitter: PropTypes.string,
  image: PropTypes.object,
};

export default SEO;
