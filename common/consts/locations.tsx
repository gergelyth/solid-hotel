/**
 * @constant The url of the pairing page in the GPA - the GPA location is loaded from the ENV config.
 * Required in order for the PMS to have an URL to which it can refer the user who doesn't have a Solid Pod yet.
 * @default
 */
export const GPAPairUrl = `${
  process.env.NEXT_PUBLIC_GPA_LOCATION ?? "http://localhost:3000/"
}pairing`;

/**
 * @constant The url of the required fields endpoint in the mock API - the mock API location is loaded from the ENV config.
 * Required for determining what personal information fields are required for booking/check-in.
 * @default
 */
export const MockApiRequiredFieldsUrl = `${
  process.env.NEXT_PUBLIC_MOCK_API_LOCATION ?? "http://localhost:3003/"
}api/requiredFields`;

/**
 * @constant The url of the data protection endpoint in the mock API - the mock API location is loaded from the ENV config.
 * Required for determining the data protection properties (required fields, length of storage) for creating data protection profiles.
 * @default
 */
export const MockApiDataProtectionUrl = `${
  process.env.NEXT_PUBLIC_MOCK_API_LOCATION ?? "http://localhost:3003/"
}api/dataprotection`;
