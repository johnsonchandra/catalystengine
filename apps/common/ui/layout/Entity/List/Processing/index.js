import { Meteor } from 'meteor/meteor';

import withTrackerSsr from '../../../../../helpers/withTrackerSsr';
import paramsProcessing from '../../../../../helpers/paramsProcessing';

import Counter from '../../../../../entities/Counter/api';
import File from '../../../../../entities/File/api';
import Notification from '../../../../../entities/Notification/api';

import EntityListProcessingElement from './EntityListProcessingElement';

export default withTrackerSsr((props) => {
  let params = { ...props };

  if (Meteor.isClient) {
    const options = {
      search: props.search,
      perPage: props.perPage,
      currentPage: props.currentPage,
      sort: {
        updatedAt: 1,
      },
    };

    const Entities = [
      { name: 'Counter', Entity: Counter },
      { name: 'File', Entity: File },
      { name: 'Notification', Entity: Notification },
    ];

    params = {
      ...params,
      ...paramsProcessing(Entities, options),
    };
  }
  return params;
})(EntityListProcessingElement);
