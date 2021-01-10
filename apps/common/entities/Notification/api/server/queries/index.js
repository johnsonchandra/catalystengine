import detailNotification from './detailNotification';

export default {
  detailNotification: (parent, args, context) =>
    detailNotification({
      context,
      _id: (parent && parent.NotificationId) || args._id,
      publishName: 'detailNotification',
    }),
  getNotification: (parent, args, context) =>
    detailNotification({
      context,
      _id: (parent && parent.NotificationId) || args._id,
      publishName: 'getNotification',
    }),
};
