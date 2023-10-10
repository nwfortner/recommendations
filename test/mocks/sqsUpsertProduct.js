'use strict';

exports.upsertProductSqsReceiveNoMessagesInput = [
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

exports.upsertProductSqsDeletResult = {
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

exports.upsertProductSqsReceiveResult = {
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
      MD5OfBody: '8ef4aa96c2afda0e1d7fa9c5144fce02',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 'active',
        name: 'test',
        tags: ['test'],
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

exports.upsertProductSqsReceiveResultNullTags = {
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
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 'active',
        name: 'test',
        tags: null,
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

exports.upsertProductSqsReceiveResultNotValidVtagzId = {
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
      MD5OfBody: 'a02423a42a313e03c99d9fccd60dbb82',
      Body: {
        type: 'upsertProduct',
        vtagzId: 'not valid vtagzId',
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 'active',
        name: 'test',
        tags: ['test'],
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

exports.upsertProductSqsReceiveResultNotValidBrandId = {
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
      MD5OfBody: '5e972401291f9dcca08634795453a15e',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: '1',
        status: 'active',
        name: 'test',
        tags: ['test'],
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

exports.upsertProductSqsReceiveResultNotValidCreatedAt = {
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
      MD5OfBody: '82b647b0baf1d57dcc779f4f927bd221',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: 'not valid createdAt',
        brandId: 1,
        status: 'active',
        name: 'test',
        tags: ['test'],
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

exports.upsertProductSqsReceiveResultNotValidName = {
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
      MD5OfBody: '130273ba1d164a1a9a70ab33ebfaa1e0',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 'active',
        name: 5,
        tags: ['test'],
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

exports.upsertProductSqsReceiveResultNotValidTags = {
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
      MD5OfBody: 'a30bee3200eb3507c18cadca0f928ca5',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 'active',
        name: 'test',
        tags: [5],
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

exports.upsertProductSqsReceiveResultNotValidStatus = {
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
      MD5OfBody: '1fffe4e3e4151e6d1eba9341532528b7',
      Body: {
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        status: 5,
        name: 'test',
        tags: ['test'],
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

exports.upsertProductArgs = {
  createdAt: '2021-01-01T00:00:00.000Z',
  vtagzId: 1234567890,
  brandId: 1,
  status: 'active',
  name: 'test',
};

exports.upsertProductTagArgs = { name: 'test' };

exports.upsertProductSqsReceiveRawResult = {
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
        type: 'upsertProduct',
        vtagzId: 1234567890,
        createdAt: '2021-01-01T00:00:00.000Z',
        brandId: 1,
        name: 'test',
        tags: ['test'],
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

exports.upsertProductSqsReceiveNoMessagesInput = [
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

exports.upsertProductSqsBatchDeleteMessagesInput = [
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

exports.upsertProductSpyReturnValue = {
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
  brandId: { low: 1, high: 0 },
  vtagzId: { low: 1234567890, high: 0 },
  name: 'test',
  status: 'active',
};

exports.upsertProductTagSpyReturnValue = { name: 'test' };
