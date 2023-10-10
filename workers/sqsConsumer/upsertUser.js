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
const upsertUser = async (recommendations, message) => {
  const {
    Body: {
      phoneNumber,
      walletAddress,
      createdAt,
      vtagzId,
      latitude,
      longitude,
      city,
      state,
      country,
      postal,
    },
  } = message;

  if (!vtagzId || typeof vtagzId !== 'number') {
    throw new RangeError('Parameter vtagzId must be a number.');
  }

  if (createdAt && !DateTime.fromISO(createdAt).isValid) {
    throw new RangeError('Parameter createdAt is not a valid ISO timestamp.');
  }

  if (phoneNumber && typeof phoneNumber !== 'string') {
    throw new TypeError('Parameter phoneNumber must be a string.');
  }

  if (walletAddress && typeof walletAddress !== 'string') {
    throw new TypeError('Parameter walletAddress must be a string.');
  }

  if (country && typeof country !== 'string') {
    throw new TypeError('Parameter country must be a string.');
  }

  if (state && typeof state !== 'string') {
    throw new TypeError('Parameter state must be a string.');
  }

  if (city && typeof city !== 'string') {
    throw new TypeError('Parameter city must be a string.');
  }

  if (latitude && typeof latitude !== 'number') {
    throw new TypeError('Parameter latitude must be a number.');
  }

  if (longitude && typeof longitude !== 'number') {
    throw new TypeError('Parameter longitude must be a number.');
  }

  if (postal && typeof postal !== 'string') {
    throw new TypeError('Parameter longitude must be a string.');
  }

  const bookmarks = [];

  // Create nodes for user, state, city, and country.
  const nodeOps = [];
  nodeOps.push(
    recommendations.upsertUser({
      phoneNumber,
      walletAddress,
      createdAt,
      vtagzId,
      latitude,
      longitude,
      postal,
    }),
  );
  state && nodeOps.push(
    recommendations.upsertState({ name: state }),
  );
  city && nodeOps.push(
    recommendations.upsertCity({ name: city }),
  );
  country && nodeOps.push(
    recommendations.upsertCountry({ name: country }),
  );

  bookmarks.push(...(await Promise.all(nodeOps)).flatMap(({ bookmarks }) => bookmarks));

  // If city, state, or country exists then create relationships from the user to those geo.
  const relationshipOps = [];
  state && relationshipOps.push(
    recommendations.upsertUserCreatedInStateRelationship({
      userVtagzId: vtagzId,
      stateName: state,
    }, bookmarks),
  );
  city && relationshipOps.push(
    recommendations.upsertUserCreatedInCityRelationship({
      userVtagzId: vtagzId,
      cityName: city,
    }, bookmarks),
  );
  country && relationshipOps.push(
    recommendations.upsertUserCreatedInCountryRelationship({
      userVtagzId: vtagzId,
      countryName: country,
    }, bookmarks),
  );

  await Promise.all(relationshipOps);

  return message;
};

module.exports = upsertUser;
