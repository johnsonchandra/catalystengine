/* eslint-disable consistent-return */

import JSZip from 'jszip';
// import Document from '../../../../Document/api';

import Document from '../../../../../../example/entities/Document/api'; // FIXME change to needed collection

let action;

// FIXME this is just example how to do export, please change
const generateZip = (zip) => {
  try {
    zip.generateAsync({ type: 'base64' }).then((content) => action.resolve({ zip: content }));
  } catch (exception) {
    throw new Error(`[exportUserData.generateZip] ${exception.message}`);
  }
};

const addDocumentsToZip = (documents, zip) => {
  try {
    documents.forEach((document) => {
      zip.file(`${document.title}.txt`, `${document.title}\n\n${document.body}`);
    });
  } catch (exception) {
    throw new Error(`[exportUserData.addDocumentsToZip] ${exception.message}`);
  }
};

const getDocuments = ({ _id }) => {
  try {
    return Document.find({ owner: _id }).fetch();
  } catch (exception) {
    throw new Error(`[exportUserData.getDocuments] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  if (!options) throw new Error('[exportUserData.validateOptions] options object is required.');
  if (!options.user) throw new Error('[exportUserData.validateOptions] options.user is required.');
};

const exportUserData = (options) => {
  try {
    validateOptions(options);
    const zip = new JSZip();
    const documents = getDocuments(options.user);
    addDocumentsToZip(documents, zip);
    generateZip(zip);
  } catch (exception) {
    action.reject(`[exportUserData] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    action = { resolve, reject };
    exportUserData(options);
  });
