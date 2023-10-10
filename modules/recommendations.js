'use strict';

// const Recommendations = require('../interfaces/recommendations.js');
const server = require('../server.js');
const {
  errorTypes: {
    RequestError,
    ServerError,
  },
} = require('../shared/errors.js');

/**
 * A product recommendation.
 * @typedef {Object} ProductRecommendation
 * @property {String} createdAt - The date the product was created.
 * @property {Number} vtagzId - The vtagz id of the product.
 * @property {Number} brandId - The vtagz id of the product's brand.
 * @property {String} status - The status of the product.
 * @property {String} name - The name of the product.
 */

/**
 * It takes a product tag name, calls the getProductRecommendationByTag function from the
 * recommendations module, and returns the results.
 *
 * @param {String} productTagName - The name of the tag to get recommendations for.
 * @returns {products:ProductRecommendation[]} An array of product recommendations.
 */
const getProductRecommendationByTag = async (productTagName) => {
  if (!productTagName) {
    throw new RequestError(
      'Parameter productTagName is required.',
    );
  }

  let products;

  try {
    products = await server.interfaces.recommendations
    .getProductRecommendationByTag({ productTagName });

    products = products.result.records.map((rec) => {
      const p = rec.get('p').properties;

      return {
        ...p,
        vtagzId: p.vtagzId.toNumber(),
      };
    });
  } catch (error) {
    logger.error({ err: error }, 'Recommendations.recommendations.getProductRecommendationByTag');

    throw new ServerError('Get product recommendations by tag failure.');
  }

  return { products };
};

module.exports = {
  getProductRecommendationByTag,
};
