import Notification from '../../entities/Notification/api';

import entityUpdate from './entityUpdate';
import parseExceptionMessage from '../parseExceptionMessage';
import entityInsert from './entityInsert';

const handleException = (
  name,
  processorId,
  Processor,
  entityName,
  entity,
  Entity,
  exception,
  party,
  tenant,
  linkUrls,
  description,
) => {
  const now = new Date();
  const message = parseExceptionMessage(exception);
  console.error(message);

  if (processorId && Processor) {
    entityUpdate(
      Processor,
      { _id: processorId },
      { response: message, status: 'Call_Exception' },
      `Exception: ${message}`,
      party,
      now,
    );
  }

  const docNotification = {
    name,
    host: tenant.host,
    from: { _id: 'System', name: 'System', type: 'System' },
    to: tenant.owner,
    type: 'Error',
    status: 'Active',
    linkUrls,
    description: description || message,
  };

  if (entity && Entity) {
    docNotification.refs = [
      {
        _id: entity._id,
        type: entityName,
        nr: entity.nr,
      },
    ];

    entityUpdate(
      Entity,
      { _id: entity._id },
      { status: 'Error' },
      `Exception: ${message}`,
      party,
      now,
    );
  }

  entityInsert(
    Notification,
    docNotification,
    `create Error Notification for ${entityName} from ${name}`,
    party,
    tenant.owner,
  );
};

export default handleException;
