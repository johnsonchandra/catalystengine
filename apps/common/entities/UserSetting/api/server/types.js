import commonFields from '../../../common_fields';

export default `
  enum UserSettingType {
    boolean
    string
    number
  }

  input UserSettingInput {
    _id: String
    host: String
    isGDPR: Boolean
    key: String
    label: String
    type: String
    value: String
    setByUser: Boolean
    updatedAt: String
  }

  type UserSetting {
    ${commonFields}
    host: String
    isGDPR: Boolean
    key: String                 # What is the key value you'll access this setting with?
    label: String               # The user-facing label for the setting.
    type: UserSettingType
    value: String
    setByUser: Boolean
  }
`;
