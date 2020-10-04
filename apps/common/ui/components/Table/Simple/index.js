import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import _ from 'lodash';

const TableSimple = ({ docs, caption }) => (
  <React.Fragment>
    <h4>{caption}</h4>
    {_.isEmpty(docs) ? (
      <p>No Data</p>
    ) : (
      <table className="table">
        <thead>
          <tr>
            {Object.keys(docs[0]).map(
              (key) =>
                key !== '_id' &&
                key !== 'owner' &&
                key !== 'style' &&
                key !== 'linkUrl' && (
                  <th key={key} scope="col">
                    {_.upperCase(key)}
                  </th>
                ),
            )}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, index) => (
            <tr key={doc._id || index} style={doc.style}>
              {Object.keys(doc).map(
                (key) =>
                  key !== '_id' &&
                  key !== 'owner' &&
                  key !== 'style' &&
                  key !== 'linkUrl' && (
                    <td
                      key={key}
                      style={doc[key] && doc[key].style ? doc[key].style : { textAlign: 'left' }}
                    >
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {doc.linkUrl ? (
                        doc.linkUrl.includes('http') ? (
                          <a href={doc.linkUrl}>
                            {doc[key] && doc[key].value ? doc[key].value : doc[key]}
                          </a>
                        ) : (
                          <Link to={doc.linkUrl}>
                            {doc[key] && doc[key].value ? doc[key].value : doc[key]}
                          </Link>
                        )
                      ) : doc[key] && doc[key].value ? (
                        doc[key].value
                      ) : (
                        doc[key]
                      )}
                    </td>
                  ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </React.Fragment>
);

TableSimple.defaultProps = {
  docs: [],
  caption: '',
};

TableSimple.propTypes = {
  docs: PropTypes.arrayOf(PropTypes.object),
  caption: PropTypes.string,
};

export default TableSimple;
