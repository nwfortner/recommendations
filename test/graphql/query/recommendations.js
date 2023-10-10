'use strict';

const mock = require('../../../shared/mocks');
const axios = require('axios');
const server = require('../../../server.js');

const makeRequest = async (query, token) => {
  const options = new Options('graphql');
  options.headers.authorization = `Bearer ${token}`;
  options.query = query;
  return axios(options);
};

beforeEach(async () => {
  await (async () => {
    // delete everything in the database
    const session = server.neo4j.session();
    await session.run('MATCH (n) DETACH DELETE n');
    await session.close();
  })();
});

describe('getProductRecommendationByTag', () => {
  beforeEach(async () => {
    await (async () => {
      const session = server.neo4j.session();
      await session
      .executeWrite(tx => tx.run(
        `
          MERGE (p1:Product { vtagzId: 123, status: "active" })
          MERGE (p2:Product { vtagzId: 124, status: "active" })
          MERGE (pt:ProductTag { name: "test" })
        `,
      ));

      await session
      .executeWrite(tx => tx.run(
        `
          MATCH (pt:ProductTag { name: "test" })
          MATCH (p:Product WHERE p.vtagzId IN [123, 124])
          MERGE (p)-[:TAGGED]->(pt)
        `,
      ));

      await session.close();
    })();
  });

  it('should return a list of product recommendations', async () => {
    await mock.up('user', undefined, false);

    const query = `#graphql
        query {
          getProductRecommendationByTag(productTagName: "test") {
            createdAt
            vtagzId
            brandId
            status
            name
          }
        }
      `;

    let getProductRecommendationByTag;
    let err;
    try {
      (
        {
          data: {
            getProductRecommendationByTag,
          },
        } = await makeRequest(query, mock.tokens.admin)
      );
    } catch (error) {
      err = error;
    }

    expect(err).to.be.undefined;
    expect(getProductRecommendationByTag).to.have.deep.members([
      {
        createdAt: null,
        vtagzId: 123,
        brandId: null,
        status: 'active',
        name: null,
      },
      {
        createdAt: null,
        vtagzId: 124,
        brandId: null,
        status: 'active',
        name: null,
      },
    ]);
  });

  it('should throw a RequestError when productTagName is not passed', async () => {
    await mock.up('user', undefined, false);

    const query = `#graphql
        query {
          getProductRecommendationByTag {
            createdAt
            vtagzId
            brandId
            status
            name
          }
        }
      `;

    let getProductRecommendationByTag;
    let err;
    try {
      (
        {
          data: {
            getProductRecommendationByTag,
          },
        } = await makeRequest(query, mock.tokens.admin)
      );
    } catch (error) {
      err = error;
    }

    expect(err).to.deep.equal([{ message: 'Parameter productTagName is required.', statusCode: 400 }]);
    expect(getProductRecommendationByTag).to.be.undefined;
  });

  it('should throw a ServerError when Recommendations.getProductRecommendationByTag fails', async () => {
    const loggerStub = sinon.stub(logger, 'error');
    sinon.stub(server.interfaces.recommendations, 'getProductRecommendationByTag').rejects('test');
    await mock.up('user', undefined, false);

    const query = `#graphql
        query {
          getProductRecommendationByTag(productTagName: "test") {
            createdAt
            vtagzId
            brandId
            status
            name
          }
        }
      `;

    let getProductRecommendationByTag;
    let err;
    try {
      (
        {
          data: {
            getProductRecommendationByTag,
          },
        } = await makeRequest(query, mock.tokens.admin)
      );
    } catch (error) {
      err = error;
    }

    expect(err).to.deep.equal([{ message: 'Get product recommendations by tag failure.', statusCode: 500 }]);
    expect(loggerStub).to.be.calledOnceWith({ err: sinon.match.instanceOf(Error) }, 'Recommendations.recommendations.getProductRecommendationByTag');
    expect(getProductRecommendationByTag).to.be.undefined;
  });
});
