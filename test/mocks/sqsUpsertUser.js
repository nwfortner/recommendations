'use strict';

exports.upsertUserSqsReceiveResult = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: '0x1234567890',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        latitude: 34.01485447848038,
        longitude: -118.49525564658916,
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        postal: '90210',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidVtagzId = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: '71ac67cbca3a18258271864ed03872df',
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: '0x1234567890',
        createdAt: '2021-01-01T00:00:00.000Z',
        vtagzId: 'not valid vtagzId',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidIsoDate = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: '2273d6e7989d8071631d06436d210642',
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: '0x1234567890',
        vtagzId: 1234567890,
        createdAt: 'not valid iso date',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidPhoneNumber = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: '12b3de837f98e08eda779a2678f8af0d',
      Body: {
        type: 'upsertUser',
        phoneNumber: 1234567890,
        walletAddress: '0x1234567890',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidWalletAddress = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidPostal = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: '1234567890',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        postal: 12345,
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidLongitude = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        longitude: '123',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidLatitude = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        latitude: '123',
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidState = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        state: 123,
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidCity = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        city: 123,
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveResultNotValidCountry = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: sinon.match.string,
      ReceiptHandle: sinon.match.string,
      MD5OfBody: sinon.match.string,
      Body: {
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: 1234567890,
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        country: 123,
      },
      Attributes: {
        SentTimestamp: sinon.match.string,
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: sinon.match.string,
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsReceiveRawResult = {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Messages: [
    {
      MessageId: '1234567890',
      ReceiptHandle: '1234567890',
      MD5OfBody: '3e08590bc563340df29ba7364e128517',
      MD5OfMessageAttributes: undefined,
      MessageAttributes: undefined,
      Body: JSON.stringify({
        type: 'upsertUser',
        phoneNumber: '+1234567890',
        walletAddress: '0x1234567890',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        latitude: 34.01485447848038,
        longitude: -118.49525564658916,
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
      }),
      Attributes: {
        SentTimestamp: '1234567890',
        ApproximateReceiveCount: '1',
        ApproximateFirstReceiveTimestamp: '1234567890',
        SenderId: '127.0.0.1',
      },
    },
  ],
};

exports.upsertUserSqsDeletResult =  {
  $metadata: {
    cfId: undefined,
    extendedRequestId: undefined,
    requestId: undefined,
    httpStatusCode: 200,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Failed: undefined,
  Successful: [
    {
      Id: '0',
    },
  ],
};

exports.upsertUserSqsReceiveNoMessagesInput = [
  {
    input: {
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 15,
      WaitTimeSeconds: 0,
      AttributeNames: ['All'],
      MessageAttributeNames: ['All'],
      QueueUrl: 'http://localhost:9324/queue/recommendations',
    },
  },
];

exports.upsertUserSqsBatchDeleteMessagesInput = [
  {
    input: {
      Entries: [
        {
          Id: 0,
          ReceiptHandle: '1234567890',
        },
      ],
      QueueUrl: 'http://localhost:9324/queue/recommendations',
    },
  },
];

exports.upsertUserArgs = {
  phoneNumber: '+1234567890',
  walletAddress: '0x1234567890',
  createdAt: '2021-01-01T00:00:00.000Z',
  vtagzId: 1234567890,
  latitude: 34.01485447848038,
  longitude: -118.49525564658916,
  postal: '90210',
};

exports.upsertUserCreatedInStateRelationshipArgs = {
  stateName: 'California',
  userVtagzId: 1234567890,
};

exports.upsertUserCreatedInCityRelationshipArgs = {
  cityName: 'Los Angeles',
  userVtagzId: 1234567890,
};

exports.upsertUserCreatedInCountryRelationshipArgs = {
  countryName: 'United States of America',
  userVtagzId: 1234567890,
};

exports.upsertUserSpyReturnValue = {
  createdAt: {
    year: { low: 2021, high: 0 },
    month: { low: 1, high: 0 },
    day: { low: 1, high: 0 },
    hour: { low: 0, high: 0 },
    minute: { low: 0, high: 0 },
    second: { low: 0, high: 0 },
    nanosecond: { low: 0, high: 0 },
    timeZoneOffsetSeconds: { low: 86400, high: 0 },
    timeZoneId: 'UTC',
  },
  phoneNumber: '+1234567890',
  vtagzId: { low: 1234567890, high: 0 },
  walletAddress: '0x1234567890',
  latitude: 34.01485447848038,
  longitude: -118.49525564658916,
  postal: '90210',
};

exports.upsertStateSpyReturnValue = {
  name: 'California',
};

exports.upsertCitySpyReturnValue = {
  name: 'Los Angeles',
};

exports.upsertCountrySpyReturnValue = {
  name: 'United States of America',
};
