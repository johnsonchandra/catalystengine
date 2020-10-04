export default `
  _id: String
  parent_id: String
  
  name: String
  shortname: String
  
  description: String
  owner: Party
  
  createdAt: String
  createdBy: String
  
  updatedAt: String
  updatedBy: String
  
  fromDate: String
  thruDate: String
  
  featureNr: Int
  sequenceNr: Int
      
  tags: [String]
  
  Files: [File]
  Images: [File]
  
  Members: [User]
  
  refs: [Ref]
  histories: [History]
`;
