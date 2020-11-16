import commonFields from '../../../common_fields';

export default `
  enum FileStatus {
    Draft
    Queue
    Processing
    Active
    Inactive
    Closed
  }

  type File {
    ${commonFields}
    
    fsUrl: String
    localUrl: String
    cloudUrl: String
    size: Int
    mimeType: String

    typeId: String
    type: String
    status: FileStatus
  }

  type FileList {
    total: Int
    docs: [File]
  }

  input FileInput {
    _id: String!
    name: String
    fsUrl: String
    localUrl: String
    cloudUrl: String
    size: Int
    mimeType: String
    typeId: String
    type: String
    description: String
  }
`;
