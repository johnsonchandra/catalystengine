import commonFields from '../../../common_fields';

export default `
  enum CounterType {
    Manual
    Cron
  }
  enum CounterStatus {
    Draft
    Queue
    Processing
    Active
    Inactive
    Closed
  }
  
  type Counter {
    ${commonFields}
    nr: String
    trxDate: String
    amount: Float
    type: CounterType
    status: CounterStatus
  }
  
  input CounterInput {
    _id: String!
    
    nr: String
    name: String
    trxDate: String
    amount: Float
    
    description: String
  }
`;
