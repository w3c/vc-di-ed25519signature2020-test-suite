/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as base58btc from 'base58-universal';
import * as vc from '@digitalbazaar/vc';
import {createSign, generateKeyPair} from 'crypto';
import canonicalize from 'canonicalize';
import {testVc as credential} from './testVc.js';
import {documentLoader} from './documentLoader.js';
import {Ed25519Signature2020} from './TestEd25519Signature2020.js';
import {getDidKey} from './helpers.js';
import {hashDigest} from './hashDigest.js';
import {klona} from 'klona';
import {promisify} from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);
// The Vcs don't expire so cache them with out ttl
const vcCache = new Map();

// this will generate the signed Vcs for the test
export async function generateTestData() {
  const {methodFor} = await getDidKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  // use copies of the validVc in other tests
  const issuedVc = await _issuedVc(key);
  const generators = new Map([
    ['incorrectCodec', () => _incorrectCodec(issuedVc)],
    ['digestSha512', async () => _incorrectDigest(key)],
    ['canonizeJcs', () => _incorrectCanonize(key)],
    ['rsaSigned', async () => _incorrectSigner(key)],
    ['validVc', () => _validVc()]
  ]);
  for(const [name, generator] of generators) {
    if(vcCache.get(name)) {
      continue;
    }
    const data = await generator();
    vcCache.set(name, data);
  }
  // store in a map with name and value
  return vcCache;
}

// removes the multibase identifier from the verificationMethod
function _incorrectCodec(credential) {
  const copy = klona(credential);
  // break the did key verification method into parts
  const parts = copy.proof.verificationMethod.split(':');
  // pop off the last part and remove the opening z
  const last = parts.pop().substr(1);
  // re-add the key material at the end
  parts.push(last);
  copy.proof.verificationMethod = parts.join(':');
  return copy;
}

// signs with an rsa key instead of an ed25519 key
async function _incorrectSigner(key) {
  const rsaKeyPair = await generateKeyPairAsync('rsa', {modulusLength: 4096});
  const suite = new Ed25519Signature2020({key});
  suite.sign = async ({verifyData, proof}) => {
    const sign = createSign('rsa-sha256');
    sign.write(verifyData);
    sign.end();
    const signatureBytes = sign.sign(rsaKeyPair.privateKey);
    proof.proofValue = `z${base58btc.encode(signatureBytes)}`;
    return proof;
  };
  const signedVc = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return signedVc;
}

async function _incorrectCanonize(key) {
  const suite = new Ed25519Signature2020({key});
  // canonize is expected to be async
  suite.canonize = async input => {
    // this will canonize using JCS
    return canonicalize(input);
  };
  const signedVc = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return signedVc;
}

async function _incorrectDigest(key) {
  const suite = new Ed25519Signature2020({
    key,
    hash: hashDigest({algorithm: 'sha512'})
  });
  const signedVc = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return signedVc;
}

function _validVc() {
  return klona(credential);
}

async function _issuedVc(key) {
  const name = 'issuedVc';
  const data = vcCache.get(name);
  if(data) {
    return data;
  }
  const suite = new Ed25519Signature2020({key});
  const signedVc = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  vcCache.set(name, signedVc);
  return signedVc;
}
