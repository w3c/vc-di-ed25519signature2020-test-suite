/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as didKey from '@digitalbazaar/did-method-key';
import {IdDecoder, IdEncoder} from 'bnid';
import varint from 'varint';

const didKeyDriver = didKey.driver();

const decoder = new IdDecoder({
  encoding: 'base58',
  multibase: true
});

// base58, multibase, fixed-length encoder
const encoder = new IdEncoder({
  encoding: 'base58',
  multibase: true
});

export const getPublicKeyBytes = async ({did}) => {
  const didDoc = await didKeyDriver.get({did});
  const multiCodecBytes = decoder.decode(didDoc.publicKeyMultibase);
  // extracts the varint bytes
  varint.decode(multiCodecBytes);
  // how many bytes were used to specify the size of the key material
  const varBytes = varint.decode.bytes;
  // return just the key material
  return multiCodecBytes.slice(varBytes, multiCodecBytes.length);
};

export const bs58Decode = ({id}) => decoder.decode(id);

export const bs58Encode = data => encoder.encode(data);
