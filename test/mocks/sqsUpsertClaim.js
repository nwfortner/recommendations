'use strict';

exports.upsertClaimSqsBatchDeleteMessagesInput = [
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

exports.upsertClaimSqsReceiveRawResult = {
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
      MD5OfBody: '8046d4ee89592170fffb2684f084f08f',
      Body: JSON.stringify({
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: 123,
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

exports.upsertClaimSqsReceiveNoMessagesInput = [
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

exports.upsertClaimArgs = {
  claimVtagzId: 123,
  userVtagzId: 123,
  productVtagzId: 123,
  latitude: 34.01485447848038,
  longitude: -118.49525564658916,
  postal: '90210',
};

exports.upsertClaimSqsReceiveResult = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: 123,
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

exports.upsertClaimSqsReceiveResultNotValidClaimVtagzId = {
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
      MD5OfBody: '88c3e26b2ac8922736d4f04d969da76a',
      Body: {
        type: 'upsertClaim',
        claimVtagzId: '123',
        userVtagzId: 123,
        productVtagzId: 123,
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

exports.upsertClaimSqsReceiveResultNotValidUserVtagzId = {
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
      MD5OfBody: '44e56a0a33e7d68a9395813345d9efeb',
      Body: {
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: '123',
        productVtagzId: 123,
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

exports.upsertClaimSqsReceiveResultNotValidProductVtagzId = {
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
      MD5OfBody: 'b6958fc3d716148e35fbb7c73644d00a',
      Body: {
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidProductLatitude = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidProductLongitude = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidProductState = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidProductCity = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidProductCountry = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
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

exports.upsertClaimSqsReceiveResultNotValidPostal = {
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
        type: 'upsertClaim',
        claimVtagzId: 123,
        userVtagzId: 123,
        productVtagzId: '123',
        country: '123',
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

exports.upsertClaimSqsDeletResult = {
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
