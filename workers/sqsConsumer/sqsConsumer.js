const {
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
} = require('@aws-sdk/client-sqs');
const {
  services: {
    recommendations: {
      sqsQueueUrl,
    },
  },
} = require('../../shared/config');
const upsertUser = require('./upsertUser.js');
const upsertProduct = require('./upsertProduct.js');
const upsertClaim = require('./upsertClaim.js');
const { isTest } = require('../../shared/config');

const operations = new Map();
operations.set('upsertUser', upsertUser);
operations.set('upsertProduct', upsertProduct);
operations.set('upsertClaim', upsertClaim);

let kill = false;

/**
 * It sets the kill variable and returns the value of kill.
 * @returns {Boolean} kill is being returned.
 */
const setKill = (state) => {
  if (typeof state !== 'boolean') {
    throw new Error('Invalid state.');
  }

  kill = state;

  return kill;
};

/**
* @description - consumes messages from an SQS queue.
* @param {import('@aws-sdk/client-sqs').SQSClient} sqs - the SQSClient object from the AWS SDK.
* @param {import('../interfaces/recommendations.js')} recommendations - Recommendations instance.
*/
const runSqsConsumer = async (sqs, recommendations) => {
  // get messages from sqs
  let receiveMessages;

  try {
    receiveMessages = await sqs.send(new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 15,
      WaitTimeSeconds: isTest ? 0 : 20,
      AttributeNames: ['All'],
      MessageAttributeNames: ['All'],
      QueueUrl: sqsQueueUrl,
    }));
  } catch (error) {
    logger.error({ err: error }, 'Recommendations.sqsConsumer.receiveMessagesError');
  }

  if (receiveMessages?.Messages?.length) {
    const messages = receiveMessages.Messages.map((message) => {
      message.Body = JSON.parse(message.Body);
      return message;
    });

    // filter out unsupported message types
    const unsupportedMessages = messages
    .filter((message) => !operations.has(message.Body.type));

    if (unsupportedMessages.length) {
      logger.error({ messages: unsupportedMessages }, 'Recommendations.sqsConsumer.unsupportedMessages');
    }

    const supportedMessages = messages
    .filter((message) => operations.has(message.Body.type));

    // store in neo4j
    const processedMessages = await Promise
    .allSettled(
      supportedMessages
      ?.map((message) => operations.get(message.Body.type)(recommendations, message)),
    );

    // log unsuccessfully processed messages
    const unsuccessfullyProcessedMessages = processedMessages.filter(message => message.status === 'rejected');

    if (unsuccessfullyProcessedMessages.length) {
      unsuccessfullyProcessedMessages
      .forEach(message => logger
      .error({ err: message.reason }, 'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages'));
    }

    // delete successfully processed messages from sqs
    const successfullyProcessedMessages = processedMessages.filter(message => message.status === 'fulfilled');

    try {
      if (successfullyProcessedMessages.length) {
        const deleteMessagesEntries = successfullyProcessedMessages
        .map((message, i) => ({ Id: i, ReceiptHandle: message.value.ReceiptHandle }));

        await sqs.send(new DeleteMessageBatchCommand({
          Entries: deleteMessagesEntries,
          QueueUrl: sqsQueueUrl,
        }));
      }
    } catch (error) {
      logger.error({ err: error }, 'Recommendations.sqsConsumer.deleteMessagesError');
    }
  }

  if (kill) {
    return;
  } else {
    runSqsConsumer(sqs, recommendations);
    return;
  }
};

module.exports = {
  runSqsConsumer,
  setKill,
};
