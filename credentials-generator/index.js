/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const vc = require('@digitalbazaar/vc');
const canonicalize = require('canonicalize');
const {createSign, generateKeyPair} = require('crypto');
const base58btc = require('base58-universal');
const {join} = require('path');
const {promisify} = require('util');
const {
  getDidKey,
  writeJson,
} = require('./helpers');
const credential = require('./testVC');
const Ed25519Signature2020 = require('./TestEd25519Signature2020');
const documentLoader = require('./documentLoader');
const {hashDigest} = require('./hashDigest');
const {klona} = require('klona');

const generateKeyPairAsync = promisify(generateKeyPair);
const credentialsPath = join(process.cwd(), 'credentials');

// this will generate the signed VCs for the test
const main = async () => {
  if(!process.env.CLIENT_SECRET_DB) {
    throw new Error(`ENV variable CLIENT_SECRET_DB is required.`);
  }
  console.log('generating credentials');
  const {methodFor} = await getDidKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  const {path, data} = await _issuedVC(key);
  // use copies of the validVC in other tests
  const validVC = data;
  // create all of the other vcs once
  const vcs = await Promise.all([
    _incorrectCodec(validVC),
    _incorrectDigest(key),
    _incorrectCanonize(key),
    _incorrectSigner(key),
    _validVC(),
    // make sure the validVC is in the list of VCs
    {path, data}
  ]);
  console.log('writing VCs to /credentialss');
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
  const signedVC = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return {path: `${credentialsPath}/rsaSigned.json`, data: signedVC};
}

async function _incorrectCanonize(key) {
  const suite = new Ed25519Signature2020({key});
  // canonize is expected to be async
  suite.canonize = async input => {
    // this will canonize using JCS
    return canonicalize(input);
  };
  const signedVC = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return {path: `${credentialsPath}/canonizeJCS.json`, data: signedVC};
}

async function _incorrectDigest(key) {
  const suite = new Ed25519Signature2020({
    key,
    hash: hashDigest({algorithm: 'sha512'})
  });
  const signedVC = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return {path: `${credentialsPath}/digestSha512.json`, data: signedVC};
}

function _validVC() {
  return {path: `${credentialsPath}/validVC.json`, data: klona(credential)};
}

async function _issuedVC(key) {
  const suite = new Ed25519Signature2020({key});
  const signedVC = await vc.issue({
    credential: klona(credential),
    suite,
    documentLoader
  });
  return {path: `${credentialsPath}/issuedVC.json`, data: signedVC};
}

// run main by calling node ./credentials-generator
main();
