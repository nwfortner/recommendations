'use strict';

const { DateTime } = require('luxon');

/**
 * Process upsertUser SQS messages.
 *
 * @param {import('@aws-sdk/client-sqs').Message} messages - An SQS messages.
 * @param {import('../../interfaces/recommendations.js')} recommendations - Recommendations
 * instance.
 * @returns {import('@aws-sdk/client-sqs').Message} An SQS messages.
 */
const upsertProduct = async (recommendations, message) => {
  const {
    Body: {
      createdAt,
      vtagzId,
      brandId,
      status,
      name,
      tags = [],
    },
  } = message;

  if (!vtagzId || typeof vtagzId !== 'number') {
    throw new TypeError('Parameter vtagzId must be a number.');
  }

  if (brandId && typeof brandId !== 'number') {
    throw new TypeError('Parameter brandId must be a number.');
  }

  if (createdAt && !DateTime.fromISO(createdAt).isValid) {
    throw new RangeError('Parameters createdAt is not a valid ISO timestamp.');
  }

  if (name && typeof name !== 'string') {
    throw new TypeError('Parameters name must be a string.');
  }

  if (status && typeof status !== 'string') {
    throw new TypeError('Parameters status must be a string.');
  }

  if (tags && (!Array.isArray(tags) || !tags.every((tag) => typeof tag === 'string'))) {
    throw new TypeError('Parameter tags must be a list of strings.');
  }

  const bookmarks = [];

  // upsert Product node
  const upsertProductResult = await recommendations.upsertProduct({
    createdAt,
    vtagzId,
    brandId,
    status,
    name,
  });

  bookmarks.push(...upsertProductResult.bookmarks);

  if (tags?.length) {
    // remove existing ProductTag relationships
    const dropProductTagRelationships = recommendations
    .dropProductTagRelationships({ productVtagzId: vtagzId });

    // upsert ProductTag nodes
    const upsertProductTags = tags
    .map(tag => recommendations
    .upsertProductTag({ name: tag }));

    const [
      dropProductTagRelationshipsResult,
      upsertProductTagsResults,
    ] = await Promise.all([
      dropProductTagRelationships,
      upsertProductTags,
    ]);

    bookmarks.push(...dropProductTagRelationshipsResult.bookmarks);
    bookmarks.push(...upsertProductTagsResults.flatMap(({ bookmarks }) => bookmarks));

    // create new ProductTag relationships
    await Promise.all(
      tags.map(
        (tag) => recommendations
        .upsertProductTagRelationship(
          {
            tagName: tag,
            productVtagzId: vtagzId,
          },
          bookmarks,
        ),
      ),
    );
  }

  return message;
};

module.exports = upsertProduct;
