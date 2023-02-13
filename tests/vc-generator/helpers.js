/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as didKey from '@digitalbazaar/did-method-key';
import {decodeSecretKeySeed} from 'bnid';

const didKeyDriver = didKey.driver();

/**
 * Takes in a bs58 mutlicodec multibase seed and returns a did key.
 *
 * @param {object} options - Options to use.
 * @param {string} [options.seedMultiBase=_seed] - A bs58 encoded string.
 *
 * @returns {Promise<object>} - Returns the resulting did key driver result.
 */
export const getDidKey = async ({
  seedMultiBase = process.env.KEY_SEED_DB
} = {}) => {
  // convert multibase seed to Uint8Array
  const seed = decodeSecretKeySeed({secretKeySeed: seedMultiBase});
  return didKeyDriver.generate({seed});
};
