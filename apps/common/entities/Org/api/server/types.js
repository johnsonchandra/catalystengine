import commonFields from '../../../common_fields';

export default `
  enum OrgType {
    Company
    Division
    Department
    PersonalMerchant
    Other
  }
  enum OrgStatus {
    Draft
    Queue
    Processing
    Active
    Inactive
    Closed
  }
  
  type Org {
    ${commonFields}
    nr: String
    logoUrl: String
    address: String
    zipCode: String
    city: String
    state: String
    country: String
    phone: String
    lat: Float
    lng: Float
    
    type: OrgType
    status: OrgStatus
    
    Users: [User]
    roles: [Role]
  }
  
  input OrgInput {
    _id: String!
    
    nr: String
    name: String
    shortname: String
    address: String
    zipCode: String
    city: String
    state: String
    country: String
    phone: String
    
    type: String
    
    description: String
    
    roles: [String]
  }
`;
