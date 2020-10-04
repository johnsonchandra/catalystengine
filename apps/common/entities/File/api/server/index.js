import createIndex from '../../../../helpers/server/createIndex';
import File from '..';

createIndex(File, { type: 1, status: 1, refs: 1, owner: 1 });
