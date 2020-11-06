import listFile from '../processors/listFile';

export default (options) =>
  new Promise((resolve, reject) => {
    listFile('listFileByRef', options, resolve, reject);
  });
