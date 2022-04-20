/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();
const {writeFile} = require('fs');
const {promisify} = require('util');
const {decodeSecretKeySeed} = require('bnid');

const asyncWriteFile = promisify(writeFile);

/**
 * Writes a json file to disc.
 *
 * @param {object} options - Options to use.
 * @param {string} options.path - A path to write to.
 * @param {object} options.data - A JSON Object.
 *
 * @returns {Promise} Resolves on write.
 */
const writeJson = async ({path, data}) => {
  return asyncWriteFile(path, JSON.stringify(data, null, 2));
};

/**
 * Takes in a bs58 mutlicodec multibase seed and returns a did key.
 *
 * @param {object} options - Options to use.
 * @param {string} [options.seedMultiBase=_seed] - A bs58 encoded string.
 *
 * @returns {Promise<object>} - Returns the resulting did key driver result.
 */
const getDidKey = async ({
  seedMultiBase = process.env.CLIENT_SECRET_DB
} = {}) => {
  // convert multibase seed to Uint8Array
  const seed = decodeSecretKeySeed({secretKeySeed: seedMultiBase});
  return didKeyDriver.generate({seed});
};

// Javascript's default ISO timestamp contains milliseconds.
// This lops off the MS part of the UTC RFC3339 TimeStamp and replaces
// it with a terminal Z.
const ISOTimeStamp = ({date = new Date()} = {}) => {
  return date.toISOString().replace(/\.\d+Z$/, 'Z');
};

module.exports = {
  getDidKey,
  writeJson,
  ISOTimeStamp
};

