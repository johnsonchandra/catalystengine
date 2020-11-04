import createIndex from '../../../../../common/helpers/server/createIndex';
import Document from '..';

createIndex(Document, { nr: 1, name: 1, owner: 1 });
