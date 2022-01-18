/*
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
const crypto = require('crypto');

module.exports = {
  /**
   * Creates a hash digest function using node's crypto lib.
   *
   * @param {object} options - Options to use.
   * @param {string} [options.algorithm = 'sha256'] - An openssl
   *   compatible hashing algorithm.
   *
   * @returns {Function} The hashing algorithm.
   */
  hashDigest({algorithm = 'sha256'} = {}) {
  /**
   * Hashes a string of data using SHA-256.
   *
   * @param {object} options - Options to use.
   * @param {string} options.string - The string to hash.
   *
   * @returns {Promise<Uint8Array>} The hash digest.
   */

    return async ({string}) => new Uint8Array(
      crypto.createHash(algorithm).update(string).digest());
  }
};
