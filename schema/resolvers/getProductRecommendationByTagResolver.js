'use strict';

const {
  getProductRecommendationByTag,
} = require('../../modules/recommendations.js');

/**
 * Returns a list of products recommendations.
 *
 * @type {import('graphql').GraphQLFieldResolver}
 * @returns A List of product recommendations.
 */
exports.getProductRecommendationByTagResolver = async function (source, args, context, info) {
  const {
    productTagName,
  } = args;

  const {
    products,
  } = await getProductRecommendationByTag(productTagName);

  return  products;
};
