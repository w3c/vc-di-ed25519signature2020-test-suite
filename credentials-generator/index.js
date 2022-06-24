/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as base58btc from 'base58-universal';
import * as vc from '@digitalbazaar/vc';
import {createSign, generateKeyPair} from 'crypto';
import {getDidKey, writeJson} from './helpers.js';
import canonicalize from 'canonicalize';
import {createRequire} from 'node:module';
import {documentLoader} from './documentLoader.js';
import {Ed25519Signature2020} from './TestEd25519Signature2020.js';
import {hashDigest} from './hashDigest.js';
import {join} from 'path';
import {klona} from 'klona';
import {promisify} from 'util';
const require = createRequire(import.meta.url);
const credential = require('./testVc.json');

const generateKeyPairAsync = promisify(generateKeyPair);
const credentialsPath = join(process.cwd(), 'credentials');

// this will generate the signed Vcs for the test
const main = async () => {
  if(!process.env.CLIENT_SECRET_DB) {
    throw new Error(`ENV variable CLIENT_SECRET_DB is required.`);
  }
  console.log('generating credentials');
  const {methodFor} = await getDidKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  const {path, data} = await _issuedVc(key);
  // use copies of the validVc in other tests
  const validVc = data;
  // create all of the other vcs once
  const vcs = await Promise.all([
    _incorrectCodec(validVc),
    _incorrectDigest(key),
    _incorrectCanonize(key),
    _incorrectSigner(key),
    _validVc(),
    // make sure the validVc is in the list of Vcs
    {path, data}
  ]);
  console.log('writing Vcs to /credentials');
  await Promise.all(vcs.map(({path, data}) => writeJson({path, data})));
  console.log(`${vcs.length} credentials generated`);
};

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
  return {path: `${credentialsPath}/incorrectCodec.json`, data: copy};
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
  return {path: `${credentialsPath}/rsaSigned.json`, data: signedVc};
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
  return {path: `${credentialsPath}/canonizeJCS.json`, data: signedVc};
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
  return {path: `${credentialsPath}/digestSha512.json`, data: signedVc};
}

function _validVc() {
  return {path: `${credentialsPath}/validVc.json`, data: klona(credential)};
}

async function _issuedVc(key) {
  const suite = new Ed25519Signature2020({key});
  const signedVc = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return {path: `${credentialsPath}/issuedVc.json`, data: signedVc};
}

// run main by calling node ./credentials-generator
main();
