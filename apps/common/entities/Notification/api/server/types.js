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
  
  type NotificationLinkUrl {
    _id: String
    name: String
    type: String
    linkUrl: String
  }
  
  type Notification {
    ${commonFields}
    
    host: String
    
    from: Party
    to: Party
    linkUrls: [NotificationLinkUrl]
    type: NotificationType
    status: NotificationStatus
  }
  
  input NotificationInput {
    _id: String!
    
    name: String
    host: String
    
    from: PartyInput
    to: PartyInput
    
    description: String
  }
`;
