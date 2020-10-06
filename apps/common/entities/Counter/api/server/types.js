import commonFields from '../../../common_fields';

export default `
  enum CounterStatus {
    Draft
    Queue
    Processing
    Active
    Closed
  }
  
  type Counter {
    ${commonFields}
    counter: Int
    type: String
    status: CounterStatus
  }
  
  input CounterInput {
    _id: String!
    
    name: String
    counter: Int
    type: String
    
    description: String
  }
`;
