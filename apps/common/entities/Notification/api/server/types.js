import commonFields from '../../../common_fields';

export default `
  enum NotificationType {
    Info
    Error
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
    from: Party
    to: Party
    type: NotificationType
    status: NotificationStatus
  }
  
  input NotificationInput {
    _id: String!
    
    name: String
    from: Party
    to: Party
    
    description: String
  }
`;
