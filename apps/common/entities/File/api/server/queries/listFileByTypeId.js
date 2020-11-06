import listFile from '../processors/listFile';

export default (options) =>
  new Promise((resolve, reject) => {
    listFile('listFileByTypeId', options, resolve, reject);
  });
