'use strict';
const neo4j = require('neo4j-driver');
const luxon = require('luxon');

class Recommendations {
  /**
   * @private
   * @type {import('neo4j-driver').Driver}
   * @description The neo4j driver instance.
   * @see https://neo4j.com/docs/api/javascript-driver/current/
   */
  #neo4j;

  constructor(params) {
    this.#neo4j = params.neo4j;
  }

  /**
 * It upserts a User node in the neo4j database.
 * @param {Object} user - The user object.
 * @param {String} [user.phoneNumber] - The phone number of the user.
 * @param {String} [user.walletAddress] - The wallet address of the user.
 * @param {String} [user.createdAt] - ISO timestamp when the user was created in the vtagz database.
 * @param {Number} user.vtagzId - This is the unique identifier for the user in the vtagz database.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async upsertUser(user, bookmarks) {
    const {
      phoneNumber,
      walletAddress,
      createdAt,
      vtagzId,
      latitude,
      longitude,
      postal,
    } = user;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MERGE 
            (
              u:User {
                vtagzId: $params.vtagzId
              }
            )
          ON CREATE
            SET
              u = $params 
          ON MATCH
            SET
              u += $params
          RETURN u
        `,
        {
          params: {
            phoneNumber,
            walletAddress,
            createdAt: createdAt && (() => {
              const {
                year, month, day, hour, minute, second, zoneName,
              } = luxon.DateTime.fromISO(createdAt, { setZone: true });

              return new neo4j.DateTime(
                year, month, day, hour, minute, second, 0, undefined, zoneName,
              );
            })(),
            vtagzId: neo4j.int(vtagzId),
            latitude,
            longitude,
            postal,
          },
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It upserts a Product node in the neo4j database.
 * @param {Object} product - The product object.
 * @param {String} [product.name] - The name of the product.
 * @param {String} [product.brandId] - The id of the brand of the product.
 * @param {String} [product.status] - The status of the product.
 * @param {String} [product.createdAt] - ISO timestamp of when the user was created in
 * the vtagz database.
 * @param {Number} product.vtagzId - This is the unique identifier for the product in
 * the vtagz database.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async upsertProduct(product, bookmarks) {
    const {
      createdAt,
      vtagzId,
      brandId,
      status,
      name,
    } = product;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MERGE 
            (
              p:Product {
                vtagzId: $params.vtagzId
              }
            )
          ON CREATE
            SET
              p = $params 
          ON MATCH
            SET
              p += $params
          RETURN p
        `,
        {
          params: {
            createdAt: (() => {
              const {
                year, month, day, hour, minute, second, zoneName,
              } = luxon.DateTime.fromISO(createdAt, { setZone: true });

              return new neo4j.DateTime(
                year, month, day, hour, minute, second, 0, undefined, zoneName,
              );
            })(),
            vtagzId: neo4j.int(vtagzId),
            brandId: neo4j.int(brandId),
            status,
            name,
          },
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It upserts a ProductTag node in the neo4j database.
 * @param {Object} productTag - The product tag object.
 * @param {String} productTag.name - The of the product tag.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async upsertProductTag(productTag, bookmarks) {
    const {
      name,
    } = productTag;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MERGE 
            (
              pt:ProductTag {
                name: $name
              }
            )
          RETURN pt
        `,
        {
          name,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It upserts a ProductTag relationship in the neo4j database.
 * @param {Object} productTagRelationship - The product tag relationship object.
 * @param {String} productTagRelationship.tagName - The name of the product tag.
 * @param {Number} productTagRelationship.productVtagzId - The vtagzId of the product.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async upsertProductTagRelationship(productTagRelationship, bookmarks) {
    const {
      tagName,
      productVtagzId,
    } = productTagRelationship;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MATCH 
            (
              p:Product {
                vtagzId: $vtagzId
              }
            ),
            (
              pt:ProductTag {
                name: $tagName
              }
            )
          MERGE (p)-[t:TAGGED]->(pt)
          RETURN p, pt, t
        `,
        {
          tagName,
          vtagzId: neo4j.int(productVtagzId),
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It deletes all ProductTag relationship for a Product in the neo4j database.
 * @param {Object} product - The product object.
 * @param {Number} productTagRelationship.productVtagzId - The vtagzId of the product.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async dropProductTagRelationships(product, bookmarks) {
    const {
      productVtagzId,
    } = product;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MATCH (p:Product { vtagzId: $vtagzId })-[t:TAGGED]->(pt:ProductTag)
          DELETE t
          RETURN p, pt, t
        `,
        {
          vtagzId: neo4j.int(productVtagzId),
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It upserts a Claim relationship for a User and Product in the neo4j database.
 * @param {Object} claimRelationship - The product tag relationship object.
 * @param {Number} claimRelationship.userVtagzId - The vtagzId of the user.
 * @param {Number} claimRelationship.productVtagzId - The vtagzId of the product.
 * @param {Number} claimRelationship.claimVtagzId - The vtagzId of the product.
 * @param {String} claimRelationship.latitude - The latitude of the user claim location.
 * @param {String} claimRelationship.longitude - The longitude of the user claim location.
 * @param {String} claimRelationship.postal - The zip code of the user claim location.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async upsertClaim(claimRelationship, bookmarks) {
    const {
      claimVtagzId,
      userVtagzId,
      productVtagzId,
      latitude,
      longitude,
      postal,
    } = claimRelationship;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
          MATCH
            (
              u:User {
                vtagzId: $userVtagzId
              }
            ),
            (
              p:Product {
                vtagzId: $productVtagzId
              }
            )
          MERGE (u)-[c:CLAIMED]->(cl:Claim)-[i:INCLUDES_PRODUCT]->(p)
          SET cl = $claimParams
          RETURN u, p, c, cl, i
        `,
        {
          userVtagzId: neo4j.int(userVtagzId),
          productVtagzId: neo4j.int(productVtagzId),
          claimParams: {
            vtagzId: neo4j.int(claimVtagzId),
            latitude,
            longitude,
            postal,
          },
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
 * It gets products related to a provided tag from the neo4j database.
 * @param {Object} recommendationParams - The product tag recommendation params.
 * @param {Object} recommendationParams.productTagName - The product tag name.
 * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
 * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
 */
  async getProductRecommendationByTag(recommendationParams, bookmarks) {
    const {
      productTagName,
    } = recommendationParams;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeRead(tx => tx.run(
        `
          MATCH 
            (:ProductTag {name: $name})<-[:TAGGED]-(p:Product {status: "active"})
          RETURN p
        `,
        {
          name: productTagName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a State node in the neo4j database.
   * @param {Object} state - The state object.
   * @param {String} state.name - The of the state.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertState(state, bookmarks) {
    const {
      name,
    } = state;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MERGE
              (
                s:State {
                  name: $name
                }
              )
            RETURN s
          `,
        {
          name,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a City node in the neo4j database.
   * @param {Object} city - The city object.
   * @param {String} city.name - The of the city.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertCity(city, bookmarks) {
    const {
      name,
    } = city;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MERGE
              (
                c:City {
                  name: $name
                }
              )
            RETURN c
          `,
        {
          name,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a Country node in the neo4j database.
   * @param {Object} country - The country object.
   * @param {String} country.name - The of the country.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertCountry(country, bookmarks) {
    const {
      name,
    } = country;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MERGE
              (
                c:Country {
                  name: $name
                }
              )
            RETURN c
          `,
        {
          name,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a UserCreatedInCity relationship for a User and City in the neo4j database.
   * @param {Object} userCreatedInCity - The user created in city relationship object.
   * @param {Number} userCreatedInCity.userVtagzId - The vtagzId of the user.
   * @param {String} userCreatedInCity.cityName - The city the user was created in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertUserCreatedInCityRelationship(userCreatedInCity, bookmarks) {
    const {
      userVtagzId,
      cityName,
    } = userCreatedInCity;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                u:User {
                  vtagzId: $userVtagzId
                }
              ),
              (
                c:City {
                  name: $cityName
                }
              )
            MERGE (u)-[ci:CREATED_IN]->(c)
            RETURN u, c, ci
          `,
        {
          userVtagzId: neo4j.int(userVtagzId),
          cityName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a UserCreatedInState relationship for a User and State in the neo4j database.
   * @param {Object} userCreatedInState - The user created in state relationship object.
   * @param {String} userCreatedInState.userVtagzId - The vtagzId of the user.
   * @param {String} userCreatedInCity.stateName - The state the user was created in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertUserCreatedInStateRelationship(userCreatedInState, bookmarks) {
    const {
      userVtagzId,
      stateName,
    } = userCreatedInState;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                u:User {
                  vtagzId: $userVtagzId
                }
              ),
              (
                s:State {
                  name: $stateName
                }
              )
            MERGE (u)-[ci:CREATED_IN]->(s)
            RETURN u, s, ci
          `,
        {
          userVtagzId: neo4j.int(userVtagzId),
          stateName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a UserCreatedInCountry relationship for a User and Country in the neo4j database.
   * @param {Object} userCreatedInCountry - The user created in country relationship object.
   * @param {String} userCreatedInCountry.userVtagzId - The vtagzId of the user.
   * @param {String} userCreatedInCity.contryName - The country the user was created in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertUserCreatedInCountryRelationship(userCreatedInCountry, bookmarks) {
    const {
      userVtagzId,
      countryName,
    } = userCreatedInCountry;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                u:User {
                  vtagzId: $userVtagzId
                }
              ),
              (
                c:Country {
                  name: $countryName
                }
              )
            MERGE (u)-[ci:CREATED_IN]->(c)
            RETURN u, c, ci
          `,
        {
          userVtagzId: neo4j.int(userVtagzId),
          countryName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a ClaimClaimedInCity relationship for a Claim and City in the neo4j database.
   * @param {Object} claimCreatedInCity - The claim claimed in city relationship object.
   * @param {Number} claimCreatedInCity.claimVtagzId - The vtagzId of the claim.
   * @param {String} claimCreatedInCity.cityName - The city the claim was claimed in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertClaimClaimedInCityRelationship(claimClaimedInCity, bookmarks) {
    const {
      claimVtagzId,
      cityName,
    } = claimClaimedInCity;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                c:Claim {
                  vtagzId: $claimVtagzId
                }
              ),
              (
                ci:City {
                  name: $cityName
                }
              )
            MERGE (c)-[cl:CLAIMED_IN]->(ci)
            RETURN c, ci, cl
          `,
        {
          claimVtagzId: neo4j.int(claimVtagzId),
          cityName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a ClaimClaimedInState relationship for a Claim and State in the neo4j database.
   * @param {Object} claimClaimedInState - The claim created in state relationship object.
   * @param {String} claimClaimedInState.claimVtagzId - The vtagzId of the claim.
   * @param {String} claimClaimedInState.stateName - The state the claim was claimed in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertClaimClaimedInStateRelationship(claimClaimedInState, bookmarks) {
    const {
      claimVtagzId,
      stateName,
    } = claimClaimedInState;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                c:Claim {
                  vtagzId: $claimVtagzId
                }
              ),
              (
                s:State {
                  name: $stateName
                }
              )
            MERGE (c)-[cl:CLAIMED_IN]->(s)
            RETURN c, s, cl
          `,
        {
          claimVtagzId: neo4j.int(claimVtagzId),
          stateName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }

  /**
   * It upserts a ClaimClaimedInCountry relationship for a Claim and Country in the neo4j database.
   * @param {Object} claimClaimedInCountry - The claim created in country relationship object.
   * @param {String} claimClaimedInCountry.userVtagzId - The vtagzId of the claim.
   * @param {String} userCreatedInCity.contryName - The country the user was created in.
   * @param {String[]} [bookmarks] - The bookmarks of the neo4j transaction.
   * @returns {{result:import('neo4j-driver').Result, bookmarks:String[]}} The result of the query.
   */
  async upsertClaimClaimedInCountryRelationship(claimClaimedInCountry, bookmarks) {
    const {
      claimVtagzId,
      countryName,
    } = claimClaimedInCountry;

    const session = this.#neo4j.session({ bookmarks });

    let result;
    const lastBookmarks = [];

    try {
      result = await session
      .executeWrite(tx => tx.run(
        `
            MATCH
              (
                c:Claim {
                  vtagzId: $claimVtagzId
                }
              ),
              (
                co:Country {
                  name: $countryName
                }
              )
            MERGE (c)-[cl:CLAIMED_IN]->(co)
            RETURN c, co, cl
          `,
        {
          claimVtagzId: neo4j.int(claimVtagzId),
          countryName,
        },
      ));
    } finally {
      lastBookmarks.push(...session.lastBookmarks());
      await session.close();
    }

    return { result, bookmarks: lastBookmarks };
  }
}

module.exports = Recommendations;
