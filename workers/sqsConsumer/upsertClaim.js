'use strict';

/**
 * Process upsertUser SQS messages.
 *
 * @param {import('@aws-sdk/client-sqs').Message} messages - An SQS messages.
 * @param {import('../../interfaces/recommendations.js')} recommendations - Recommendations
 * instance.
 * @returns {import('@aws-sdk/client-sqs').Message} An SQS messages.
 */
const upsertClaim = async (recommendations, message) => {
  const {
    Body: {
      claimVtagzId,
      userVtagzId,
      productVtagzId,
      latitude,
      longitude,
      city,
      state,
      country,
      postal,
    },
  } = message;

  if (typeof claimVtagzId !== 'number') {
    throw new TypeError('Parameters claimVtagzId must be a number.');
  }

  if (typeof userVtagzId !== 'number') {
    throw new TypeError('Parameters userVtagzId must be a number.');
  }

  if (typeof productVtagzId !== 'number') {
    throw new TypeError('Parameters productVtagzId must be a number.');
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

  // create nodes for user, state, city, and country
  const nodeOps = [];
  nodeOps.push(
    recommendations
    .upsertClaim({
      claimVtagzId,
      userVtagzId,
      productVtagzId,
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
    recommendations.upsertClaimClaimedInStateRelationship({
      claimVtagzId,
      stateName: state,
    }, bookmarks),
  );
  city && relationshipOps.push(
    recommendations.upsertClaimClaimedInCityRelationship({
      claimVtagzId,
      cityName: city,
    }, bookmarks),
  );
  country && relationshipOps.push(
    recommendations.upsertClaimClaimedInCountryRelationship({
      claimVtagzId,
      countryName: country,
    }, bookmarks),
  );

  await Promise.all(relationshipOps);

  return message;
};

module.exports = upsertClaim;
