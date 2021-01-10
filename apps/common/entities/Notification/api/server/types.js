import commonFields from '../../../common_fields';

export default `
  enum NotificationType {
    Manual
    Cron
  }
  enum NotificationStatus {
    Draft
    Queue
    Processing
    Active
    Closed
  }
  
  type Notification {
    ${commonFields}
    nr: String
    trxDate: String
    amount: Float
    type: NotificationType
    status: NotificationStatus
  }
  
  input NotificationInput {
    _id: String!
    
    nr: String
    name: String
    trxDate: String
    amount: Float
    
    description: String
  }
`;
