import commonFields from '../../../common_fields';

export default `
  enum TenantType {
    Host
    Dummy
  }
  enum TenantStatus {
    Draft
    Queue
    Processing
    Active
    Inactive
    Closed
  }
  
  type Tenant {
    ${commonFields}
    nr: String
    trxDate: String
    amount: Float
    type: TenantType
    status: TenantStatus
  }
  
  input TenantInput {
    _id: String!
    
    nr: String
    name: String
    trxDate: String
    amount: Float
    
    description: String
  }
`;
