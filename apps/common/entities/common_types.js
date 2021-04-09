export default `
  type reportEntity {
    timestamp: String
    total: String
    docs: String
  }
  
  type Ref {
    _id: String
    nr: String
    name: String
    shortname: String
    type: String
    role: String
    host: String
    logoUrl: String
    timestamp: String
  }

  type Phone {
    verified: Boolean
    type: String
    number: String
  }

  enum PartyType {
    Org
    Member
    Webhook
    Cron
    System
    Dummy
  }

  type Party {
    _id: String
    type: PartyType
    name: String
    shortname: String
    logoUrl: String
    latitude: Float
    longitude: Float
    description: String
  }
  
  input PartyInput {
    _id: String!
    
    type: PartyType
    name: String
    shortname: String
    logoUrl: String
    latitude: Float
    longitude: Float
    description: String
  }
  
  type History{
    party: Party
    timestamp: String
    doc: String
    description: String
  }
`;
