'use strict';

const {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
} = require('graphql');
const {
  GraphQLDateTime,
} = require('graphql-scalars');

exports.ProductRecommendation = new GraphQLObjectType({
  name: 'ProductRecommendation',
  fields: {
    createdAt: { type: GraphQLDateTime },
    vtagzId: { type: GraphQLInt },
    brandId: { type: GraphQLInt },
    status: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  description: 'A vtagz product recommendation',
});
