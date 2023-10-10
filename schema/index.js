'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require('graphql');
// types
const { ProductRecommendation } = require('./types/productRecommendation.js');
// resolvers
const { getProductRecommendationByTagResolver } = require('./resolvers/getProductRecommendationByTagResolver.js');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getProductRecommendationByTag: {
        type: new GraphQLList(ProductRecommendation),
        args: {
          productTagName: { type: GraphQLString },
        },
        resolve: getProductRecommendationByTagResolver,
        description: 'Gets product recommendations for the provided tag.',
      },
    },
  }),
});

module.exports = schema;
