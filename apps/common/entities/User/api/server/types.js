import commonFields from '../../../common_fields';

export default `
  type Role {
    name: String
    value: String
    defaultChecked: Boolean
  }
  
  input UserProfileInput {
    fullname: String
    shortname: String
    phone: String
  }
  
  input UserInput {
    _id: String
    email: String
    password: String
    profile: UserProfileInput
    settings: [UserSettingInput]
    roles: [String]
  }

  type User {
    ${commonFields}
    fullname: String
    emailAddress: String
    phone: String
    roles: [Role]
    settings: [UserSetting]
  }

  type UserExportDataZip {
    zip: String
  }
`;
