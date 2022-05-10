/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const didKeyDriver = require('@digitalbazaar/did-method-key').driver();
const {IdDecoder, IdEncoder} = require('bnid');
const varint = require('varint');

const decoder = new IdDecoder({
  encoding: 'base58',
  multibase: true
});

// base58, multibase, fixed-length encoder
const encoder = new IdEncoder({
  encoding: 'base58',
  multibase: true
});

/**
 * Takes in a Map and a predicate and returns a new Map
 * only returning key value pairs that are true.
 *
 * @param {object} options - Options to use.
 * @param {Map} options.map - A Map.
 * @param {Function<boolean>} options.predicate - A function to
 * filter the map's entries on.
 *
 * @returns {Map} Returns a map.
 */
const filterMap = ({map, predicate}) => {
  const filtered = new Map();
  for(const [key, value] of map) {
    const result = predicate({key, value});
    if(result === true) {
      filtered.set(key, value);
    }
  }
  return filtered;
};

const getPublicKeyBytes = async ({did}) => {
  const didDoc = await didKeyDriver.get({did});
  const multiCodecBytes = decoder.decode(didDoc.publicKeyMultibase);
  // extracts the varint bytes
  varint.decode(multiCodecBytes);
  // how many bytes were used to specify the size of the key material
  const varBytes = varint.decode.bytes;
  // return just the key material
  return multiCodecBytes.slice(varBytes, multiCodecBytes.length);
};

const bs58Decode = ({id}) => decoder.decode(id);

const bs58Encode = data => encoder.encode(data);

module.exports = {
  bs58Encode,
  bs58Decode,
  filterMap,
  getPublicKeyBytes
};
