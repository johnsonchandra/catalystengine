import commonFields from '../../../../../common/entities/common_fields';

export default `
  enum DocumentType {
    Manual
    Cron
  }
  enum DocumentStatus {
    Draft
    Queue
    Processing
    Active
    Closed
  }
  
  type Document {
    ${commonFields}
    nr: String
    trxDate: String
    amount: Float
    type: DocumentType
    status: DocumentStatus
  }
  
  input DocumentInput {
    _id: String!
    
    nr: String
    name: String
    trxDate: String
    amount: Float
    
    description: String
  }
`;
