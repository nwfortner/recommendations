const {
  runSqsConsumer,
  setKill,
} = require('../../workers/sqsConsumer/sqsConsumer.js');
const Recommendations = require('../../interfaces/recommendations.js');
const {
  services: {
    recommendations: {
      sqsQueueUrl,
      sqsQueueEndpoint,
    },
  },
  neo4j: {
    url,
    user,
    password,
  },
} = require('../../shared/config');
const neo4j = require('neo4j-driver');
const {
  SQSClient,
  PurgeQueueCommand,
  SendMessageCommand,
} = require('@aws-sdk/client-sqs');
const {
  upsertUserSqsReceiveResult,
  upsertUserSqsReceiveResultNotValidVtagzId,
  upsertUserSqsReceiveResultNotValidIsoDate,
  upsertUserSqsReceiveResultNotValidPhoneNumber,
  upsertUserSqsReceiveResultNotValidWalletAddress,
  upsertUserSqsDeletResult,
  upsertUserSqsReceiveNoMessagesInput,
  upsertUserArgs,
  upsertUserSqsReceiveRawResult,
  upsertUserSqsBatchDeleteMessagesInput,
  upsertUserSpyReturnValue,
  upsertStateSpyReturnValue,
  upsertCitySpyReturnValue,
  upsertCountrySpyReturnValue,
  upsertUserCreatedInStateRelationshipArgs,
  upsertUserCreatedInCityRelationshipArgs,
  upsertUserCreatedInCountryRelationshipArgs,
  upsertUserSqsReceiveResultNotValidCountry,
  upsertUserSqsReceiveResultNotValidCity,
  upsertUserSqsReceiveResultNotValidState,
  upsertUserSqsReceiveResultNotValidLongitude,
  upsertUserSqsReceiveResultNotValidLatitude,
  upsertUserSqsReceiveResultNotValidPostal,
} = require('../mocks/sqsUpsertUser.js');
const {
  upsertProductArgs,
  upsertProductSqsReceiveResultNotValidVtagzId,
  upsertProductSqsReceiveResultNotValidBrandId,
  upsertProductSqsReceiveResultNotValidCreatedAt,
  upsertProductSqsReceiveResultNotValidName,
  upsertProductSqsReceiveResultNotValidStatus,
  upsertProductSqsReceiveResultNotValidTags,
  upsertProductTagArgs,
  upsertProductSqsDeletResult,
  upsertProductSqsReceiveResult,
  upsertProductSqsReceiveResultNullTags,
  upsertProductSqsReceiveRawResult,
  upsertProductSqsReceiveNoMessagesInput,
  upsertProductSqsBatchDeleteMessagesInput,
  upsertProductSpyReturnValue,
  upsertProductTagSpyReturnValue,
} = require('../mocks/sqsUpsertProduct.js');
const {
  upsertClaimArgs,
  upsertClaimSqsDeletResult,
  upsertClaimSqsReceiveResult,
  upsertClaimSqsReceiveResultNotValidClaimVtagzId,
  upsertClaimSqsReceiveResultNotValidUserVtagzId,
  upsertClaimSqsReceiveResultNotValidProductVtagzId,
  upsertClaimSqsReceiveNoMessagesInput,
  upsertClaimSqsReceiveRawResult,
  upsertClaimSqsBatchDeleteMessagesInput,
  upsertClaimSqsReceiveResultNotValidProductLatitude,
  upsertClaimSqsReceiveResultNotValidProductLongitude,
  upsertClaimSqsReceiveResultNotValidProductState,
  upsertClaimSqsReceiveResultNotValidProductCity,
  upsertClaimSqsReceiveResultNotValidProductCountry,
  upsertClaimSqsReceiveResultNotValidPostal,
} = require('../mocks/sqsUpsertClaim.js');
const {
  upsertStateArgs,
  upsertCityArgs,
  upsertCountryArgs,
} = require('../mocks/upsertGeo.js');

const sqs = new SQSClient({
  endpoint: sqsQueueEndpoint,
});

const neo4jDriver = neo4j.driver(
  url,
  neo4j.auth.basic(user, password),
);

const recommendations = new Recommendations({ neo4j: neo4jDriver });

describe('SQS Consumer', () => {
  beforeEach(async () => {
    await sqs.send(new PurgeQueueCommand({
      QueueUrl: sqsQueueUrl,
    }));
    await (async () => {
      // delete everything in the database
      const session = neo4jDriver.session();
      await session.run('MATCH (n) DETACH DELETE n');
      await session.close();
    })();
    setKill(true);
  });

  describe('runSqsConsumer', () => {
    describe('upsertUser', () => {
      it('should receive and delete messages from the queue', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
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
          ),
        }));

        const upsertUserSpy = sinon.spy(recommendations, 'upsertUser');
        const upsertStateSpy = sinon.spy(recommendations, 'upsertState');
        const upsertCitySpy = sinon.spy(recommendations, 'upsertCity');
        const upsertCountrySpy = sinon.spy(recommendations, 'upsertCountry');
        const upsertUserCreatedInStateRelationshipSpy = sinon.spy(recommendations, 'upsertUserCreatedInStateRelationship');
        const upsertUserCreatedInCityRelationshipSpy = sinon.spy(recommendations, 'upsertUserCreatedInCityRelationship');
        const upsertUserCreatedInCountryRelationshipSpy = sinon.spy(recommendations, 'upsertUserCreatedInCountryRelationship');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(await sendSpy.firstCall.returnValue, upsertUserSqsReceiveResult);
        sinon.assert.match(await sendSpy.secondCall.returnValue, upsertUserSqsDeletResult);
        expect(upsertUserSpy).to.be.calledOnceWith(upsertUserArgs);
        expect(upsertStateSpy).to.be.calledOnceWith(upsertStateArgs);
        expect(upsertCitySpy).to.be.calledOnceWith(upsertCityArgs);
        expect(upsertCountrySpy).to.be.calledOnceWith(upsertCountryArgs);
        expect(upsertUserCreatedInStateRelationshipSpy)
        .to.be.calledOnceWith(upsertUserCreatedInStateRelationshipArgs);
        expect(upsertUserCreatedInCityRelationshipSpy)
        .to.be.calledOnceWith(upsertUserCreatedInCityRelationshipArgs);
        expect(upsertUserCreatedInCountryRelationshipSpy)
        .to.be.calledOnceWith(upsertUserCreatedInCountryRelationshipArgs);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertUserSpy.returnValues[0]).result.records[0].get('u').properties,
            ),
          ),
        ).to.deep.equal(upsertUserSpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertStateSpy.returnValues[0]).result.records[0].get('s').properties,
            ),
          ),
        ).to.deep.equal(upsertStateSpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertCitySpy.returnValues[0]).result.records[0].get('c').properties,
            ),
          ),
        ).to.deep.equal(upsertCitySpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertCountrySpy.returnValues[0]).result.records[0].get('c').properties,
            ),
          ),
        ).to.deep.equal(upsertCountrySpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertUserCreatedInStateRelationshipSpy.returnValues[0]).result.records[0].get('ci').type,
            ),
          ),
        ).to.equal('CREATED_IN');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertUserCreatedInCityRelationshipSpy.returnValues[0]).result.records[0].get('ci').type,
            ),
          ),
        ).to.equal('CREATED_IN');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertUserCreatedInCountryRelationshipSpy.returnValues[0]).result.records[0].get('ci').type,
            ),
          ),
        ).to.equal('CREATED_IN');
      });

      it('should log an error if vtagzId fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: '0x1234567890',
              vtagzId: 'not valid vtagzId',
              createdAt: '2021-01-01T00:00:00.000Z',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidVtagzId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if createdAt fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: '0x1234567890',
              vtagzId: 1234567890,
              createdAt: 'not valid iso date',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidIsoDate,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if phoneNumber fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: 1234567890,
              walletAddress: '0x1234567890',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidPhoneNumber,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if longitude fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              longitude: '123',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidLongitude,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if latitude fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              latitude: '123',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidLatitude,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if state fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              state: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidState,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if city fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              city: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidCity,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if country fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              country: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidCountry,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if walletAddress fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: 1234567890,
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidWalletAddress,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if postal fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertUser',
              phoneNumber: '+1234567890',
              walletAddress: '1234567890',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              postal: 12345,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertUserSqsReceiveResultNotValidPostal,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should return if there are no message in the queue', async () => {
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertUserSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if the message type is unsupported', async () => {
        const loggerStub = sinon.stub(logger, 'error');

        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertTest',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              tags: ['test'],
            },
          ),
        }));

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          {
            messages: [
              {
                MessageId: sinon.match.string,
                ReceiptHandle: sinon.match.string,
                MD5OfBody: 'b812282d919db3339d497e10befb57a7',
                Body: {
                  type: 'upsertTest',
                  vtagzId: 1234567890,
                  createdAt: '2021-01-01T00:00:00.000Z',
                  brandId: 1,
                  name: 'test',
                  tags: ['test'],
                },
                Attributes: {
                  SentTimestamp: sinon.match.string,
                  ApproximateFirstReceiveTimestamp: sinon.match.string,
                  ApproximateReceiveCount: '1',
                  SenderId: '127.0.0.1',
                },
              },
            ],
          }, 'Recommendations.sqsConsumer.unsupportedMessages',
        );
      });

      it('should log an error if ReceiveMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send').rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.receiveMessagesError',
        );
        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertUserSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if DeleteMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send')
        .onFirstCall()
        .resolves(upsertUserSqsReceiveRawResult)
        .onSecondCall()
        .rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.deleteMessagesError',
        );
        expect(sendSpy).to.have.been.calledTwice;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertUserSqsReceiveNoMessagesInput[0].input);
        expect(sendSpy.args[1][0].input)
        .to.deep.equal(upsertUserSqsBatchDeleteMessagesInput[0].input);
      });
    });

    describe('upsertProduct', () => {
      it('should receive and delete messages from the queue', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              status: 'active',
              tags: ['test'],
            },
          ),
        }));

        const upsertProductSpy = sinon.spy(recommendations, 'upsertProduct');
        const upsertProductTagSpy = sinon.spy(recommendations, 'upsertProductTag');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(await sendSpy.firstCall.returnValue, upsertProductSqsReceiveResult);
        sinon.assert.match(await sendSpy.secondCall.returnValue, upsertProductSqsDeletResult);
        expect(upsertProductSpy).to.be.calledOnceWith(upsertProductArgs);
        expect(upsertProductTagSpy).to.be.calledOnceWith(upsertProductTagArgs);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertProductSpy.returnValues[0]).result.records[0].get('p').properties,
            ),
          ),
        ).to.deep.equal(upsertProductSpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertProductTagSpy.returnValues[0]).result.records[0].get('pt').properties,
            ),
          ),
        ).to.deep.equal(upsertProductTagSpyReturnValue);
      });

      it('should receive and delete messages from the queue when tags are null', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              status: 'active',
              tags: null,
            },
          ),
        }));

        const upsertProductSpy = sinon.spy(recommendations, 'upsertProduct');
        const upsertProductTagSpy = sinon.spy(recommendations, 'upsertProductTag');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue, upsertProductSqsReceiveResultNullTags,
        );
        sinon.assert.match(
          await sendSpy.secondCall.returnValue, upsertProductSqsDeletResult,
        );
        expect(upsertProductSpy).to.be.calledOnceWith(upsertProductArgs);
        expect(upsertProductTagSpy).to.not.be.called;
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertProductSpy.returnValues[0]).result.records[0].get('p').properties,
            ),
          ),
        ).to.deep.equal(upsertProductSpyReturnValue);
      });

      it('should return if there are no message in the queue', async () => {
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertProductSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if vtagzId fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 'not valid vtagzId',
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              status: 'active',
              tags: ['test'],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidVtagzId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if brandId fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: '1',
              name: 'test',
              status: 'active',
              tags: ['test'],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidBrandId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if createdAt fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: 'not valid createdAt',
              brandId: 1,
              name: 'test',
              status: 'active',
              tags: ['test'],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidCreatedAt,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if status fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              status: 5,
              tags: ['test'],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidStatus,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if name fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 5,
              status: 'active',
              tags: ['test'],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidName,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if tags fails validation', async () => {
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertProduct',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              status: 'active',
              tags: [5],
            },
          ),
        }));

        const sendSpy = sinon.spy(sqs, 'send');
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertProductSqsReceiveResultNotValidTags,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if the message type is unsupported', async () => {
        const loggerStub = sinon.stub(logger, 'error');

        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertTest',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              tags: ['test'],
            },
          ),
        }));

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          {
            messages: [
              {
                MessageId: sinon.match.string,
                ReceiptHandle: sinon.match.string,
                MD5OfBody: 'b812282d919db3339d497e10befb57a7',
                Body: {
                  type: 'upsertTest',
                  vtagzId: 1234567890,
                  createdAt: '2021-01-01T00:00:00.000Z',
                  brandId: 1,
                  name: 'test',
                  tags: ['test'],
                },
                Attributes: {
                  SentTimestamp: sinon.match.string,
                  ApproximateFirstReceiveTimestamp: sinon.match.string,
                  ApproximateReceiveCount: '1',
                  SenderId: '127.0.0.1',
                },
              },
            ],
          }, 'Recommendations.sqsConsumer.unsupportedMessages',
        );
      });

      it('should log an error if ReceiveMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send').rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.receiveMessagesError',
        );
        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertProductSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if DeleteMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send')
        .onFirstCall()
        .resolves(upsertProductSqsReceiveRawResult)
        .onSecondCall()
        .rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.deleteMessagesError',
        );
        expect(sendSpy).to.have.been.calledTwice;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertProductSqsReceiveNoMessagesInput[0].input);
        expect(sendSpy.args[1][0].input)
        .to.deep.equal(upsertProductSqsBatchDeleteMessagesInput[0].input);
      });
    });

    describe('upsertClaim', () => {
      it('should receive and delete messages from the queue', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
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
          ),
        }));

        const upsertClaimSpy = sinon.spy(recommendations, 'upsertClaim');
        const upsertStateSpy = sinon.spy(recommendations, 'upsertState');
        const upsertCitySpy = sinon.spy(recommendations, 'upsertCity');
        const upsertCountrySpy = sinon.spy(recommendations, 'upsertCountry');
        const upsertClaimClaimedInStateRelationshipSpy = sinon.spy(recommendations, 'upsertClaimClaimedInStateRelationship');
        const upsertClaimClaimedInCityRelationshipSpy = sinon.spy(recommendations, 'upsertClaimClaimedInCityRelationship');
        const upsertClaimClaimedInCountryRelationshipSpy = sinon.spy(recommendations, 'upsertClaimClaimedInCountryRelationship');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(await sendSpy.firstCall.returnValue, upsertClaimSqsReceiveResult);
        sinon.assert.match(await sendSpy.secondCall.returnValue, upsertClaimSqsDeletResult);
        expect(upsertClaimSpy).to.be.calledOnceWith(upsertClaimArgs);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimSpy.returnValues[0]).result.records[0].get('cl').properties,
            ),
          ),
        ).to.eql({
          vtagzId: { low: 123, high: 0 }, latitude: 34.01485447848038, longitude: -118.49525564658916, postal: '90210',
        });
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimSpy.returnValues[0]).result.records[0].get('c').type,
            ),
          ),
        ).to.equal('CLAIMED');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimSpy.returnValues[0]).result.records[0].get('i').type,
            ),
          ),
        ).to.equal('INCLUDES_PRODUCT');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimSpy.returnValues[0]).result.records[0].get('i').type,
            ),
          ),
        ).to.equal('INCLUDES_PRODUCT');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertStateSpy.returnValues[0]).result.records[0].get('s').properties,
            ),
          ),
        ).to.deep.equal(upsertStateSpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertCitySpy.returnValues[0]).result.records[0].get('c').properties,
            ),
          ),
        ).to.deep.equal(upsertCitySpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertCountrySpy.returnValues[0]).result.records[0].get('c').properties,
            ),
          ),
        ).to.deep.equal(upsertCountrySpyReturnValue);
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimClaimedInStateRelationshipSpy.returnValues[0]).result.records[0].get('cl').type,
            ),
          ),
        ).to.equal('CLAIMED_IN');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimClaimedInCityRelationshipSpy.returnValues[0]).result.records[0].get('cl').type,
            ),
          ),
        ).to.equal('CLAIMED_IN');
        expect(
          JSON.parse(
            JSON.stringify(
              (await upsertClaimClaimedInCountryRelationshipSpy.returnValues[0]).result.records[0].get('cl').type,
            ),
          ),
        ).to.equal('CLAIMED_IN');
      });

      it('should return if there are no message in the queue', async () => {
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertClaimSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if claimVtagzId fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: '123',
              userVtagzId: 123,
              productVtagzId: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidClaimVtagzId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if userVtagzId fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: '123',
              productVtagzId: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidUserVtagzId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if productVtagzId fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductVtagzId,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if latitude fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              latitude: '123',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductLatitude,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if longitude fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              longitude: '123',
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductLongitude,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if city fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              city: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductCity,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if state fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              state: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductState,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if country fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              country: 123,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidProductCountry,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if postal fails validation', async () => {
        await (async () => {
          // create user and product
          const session = neo4jDriver.session();
          await session
          .executeWrite(tx => tx.run(
            `MERGE (u:User {vtagzId: 123}) 
             MERGE (p:Product { vtagzId: 123 })`,
          ));
          await session.close();
        })();
        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertClaim',
              claimVtagzId: 123,
              userVtagzId: 123,
              productVtagzId: '123',
              country: '123',
              postal: 12345,
            },
          ),
        }));

        const loggerStub = sinon.stub(logger, 'error');
        const sendSpy = sinon.spy(sqs, 'send');

        await runSqsConsumer(sqs, recommendations);

        sinon.assert.match(
          await sendSpy.firstCall.returnValue,
          upsertClaimSqsReceiveResultNotValidPostal,
        );
        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) },
          'Recommendations.sqsConsumer.unsuccessfullyProcessedMessages',
        );
      });

      it('should log an error if the message type is unsupported', async () => {
        const loggerStub = sinon.stub(logger, 'error');

        await sqs.send(new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageBody: JSON.stringify(
            {
              type: 'upsertTest',
              vtagzId: 1234567890,
              createdAt: '2021-01-01T00:00:00.000Z',
              brandId: 1,
              name: 'test',
              tags: ['test'],
            },
          ),
        }));

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          {
            messages: [
              {
                MessageId: sinon.match.string,
                ReceiptHandle: sinon.match.string,
                MD5OfBody: 'b812282d919db3339d497e10befb57a7',
                Body: {
                  type: 'upsertTest',
                  vtagzId: 1234567890,
                  createdAt: '2021-01-01T00:00:00.000Z',
                  brandId: 1,
                  name: 'test',
                  tags: ['test'],
                },
                Attributes: {
                  SentTimestamp: sinon.match.string,
                  ApproximateFirstReceiveTimestamp: sinon.match.string,
                  ApproximateReceiveCount: '1',
                  SenderId: '127.0.0.1',
                },
              },
            ],
          }, 'Recommendations.sqsConsumer.unsupportedMessages',
        );
      });

      it('should log an error if ReceiveMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send').rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.receiveMessagesError',
        );
        expect(sendSpy).to.have.been.calledOnce;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertClaimSqsReceiveNoMessagesInput[0].input);
      });

      it('should log an error if DeleteMessageCommand fails', async () => {
        const sendSpy = sinon.stub(sqs, 'send')
        .onFirstCall()
        .resolves(upsertClaimSqsReceiveRawResult)
        .onSecondCall()
        .rejects();
        const loggerStub = sinon.stub(logger, 'error');

        await runSqsConsumer(sqs, recommendations);

        expect(loggerStub).to.have.been.calledOnceWith(
          { err: sinon.match.instanceOf(Error) }, 'Recommendations.sqsConsumer.deleteMessagesError',
        );
        expect(sendSpy).to.have.been.calledTwice;
        expect(sendSpy.args[0][0].input)
        .to.deep.equal(upsertClaimSqsReceiveNoMessagesInput[0].input);
        expect(sendSpy.args[1][0].input)
        .to.deep.equal(upsertClaimSqsBatchDeleteMessagesInput[0].input);
      });
    });
  });

  describe('setKill', () => {
    it('should return a boolean', () => {
      const result = setKill(true);
      expect(result).to.be.true;
    });

    it('should throw an error if the argument is not a boolean', () => {
      expect(setKill.bind(null, 'true')).to.throw('Invalid state.');
    });
  });
});
