/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const vc = require('@digitalbazaar/vc');
const canonicalize = require('canonicalize');
const {createSign, generateKeyPair} = require('crypto');
const {join} = require('path');
const {promisify} = require('util');
const {
  cloneJSON,
  getDiDKey,
  writeJSON
} = require('./helpers');
const implementations = require('../implementations');
const credential = require('./testVC');
const Ed25519Signature2020 = require('./TestEd25519Signature2020');
const documentLoader = require('./documentLoader');
const {hashDigest} = require('./hashDigest');

const generateKeyPairAsync = promisify(generateKeyPair);
const credentialsPath = join(process.cwd(), 'credentials');

// this will generate the signed VCs for the test
const main = async () => {
  if(!process.env.ED25519_TEST_CONFIG_FILE) {
    throw new Error(`ENV variable ED25519_TEST_CONFIG_FILE is required.`);
  }
  const config = require(process.env.ED25519_TEST_CONFIG_FILE);
  console.log('generating vcs');
  const {methodFor} = await getDiDKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  const {path, data} = await _validVC(key);
  // use copies of the validVC in other tests
  const validVC = data.credential;
  // create all of the other vc
  const vcs = await Promise.all([
    _noProofValue(validVC),
    _noProofPurpose(validVC),
    _noProofCreated(validVC),
    _noProofType(validVC),
    _incorrectCodec(validVC),
    _incorrectDigest(key),
    _incorrectCanonize(key),
    _incorrectSigner(key)
  ]);
  console.log('writing vcs to /credentials');
  // write them to disk
  await Promise.all([
    ...vcs,
    // add the valid vc to the list
    {path, data}
  ].map(writeJSON));
  console.log('vcs generated');
};

function _incorrectCodec(credential) {
  const copy = cloneJSON(credential);
  // break the did key verification method into parts
  const parts = copy.proof.verificationMethod.split(':');
  // pop off the last part and remove the opening z
  const last = parts.pop().substr(1);
  // re-add the key material at the end
  parts.push(last);
  copy.proof.verificationMethod = parts.join(':');
  const title = 'should not verify if key material is not ' +
    'MULTIBASE & MULTICODEC';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  return {path: `${credentialsPath}/incorrectCodec.json`, data};

}

async function _incorrectSigner(key) {
  const rsaKeyPair = await generateKeyPairAsync('rsa', {modulusLength: 4096});
  const suite = new Ed25519Signature2020({key});
  suite.sign = async ({verifyData, proof}) => {
    const sign = createSign('rsa-sha256');
    sign.write(verifyData);
    sign.end();
    proof.proofValue = sign.sign(rsaKeyPair.privateKey, 'base64');
    return proof;
  };

  const signedVC = await vc.issue({
    credential: cloneJSON(credential),
    suite,
    documentLoader
  });

  const title = 'should not verify if signer is not Ed25519';
  const data = {
    negative: true,
    credential: signedVC,
    row: title,
    title
  };
  return {path: `${credentialsPath}/rsaSigned.json`, data};
}

async function _incorrectCanonize(key) {
  const suite = new Ed25519Signature2020({key});
  // canonize is expected to be async
  suite.canonize = async input => {
    // this will canonize using JCS
    return canonicalize(input);
  };
  const signedVC = await vc.issue({
    credential: cloneJSON(credential),
    suite,
    documentLoader
  });
  const title = 'should not verify if canonize algorithm is not URDNA2015';
  const data = {
    negative: true,
    credential: signedVC,
    row: title,
    title
  };
  return {path: `${credentialsPath}/canonizeJCS.json`, data};
}

async function _incorrectDigest(key) {
  const suite = new Ed25519Signature2020({
    key,
    hash: hashDigest({algorithm: 'sha512'})
  });
  const signedVC = await vc.issue({
    credential: cloneJSON(credential),
    suite,
    documentLoader
  });
  const title = 'should not verify if digest is not sha-256';
  const data = {
    negative: true,
    credential: signedVC,
    row: title,
    title
  };
  return {path: `${credentialsPath}/digestSha512.json`, data};
}

function _noProofType(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.type;
  const title = 'should not verify a proof with out a type';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  return {path: `${credentialsPath}/noProofType.json`, data};
}

function _noProofCreated(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.created;
  const title = 'should not verify a proof with out a created';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  return {path: `${credentialsPath}/noProofCreatedVC.json`, data};
}

function _noProofPurpose(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.proofPurpose;
  const title = 'should not verify a proof with out a proofPurpose';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  return {path: `${credentialsPath}/noProofPurposeVC.json`, data};
}

function _noProofValue(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.proofValue;
  const title = 'should not verify a proof with out a proofValue';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  return {path: `${credentialsPath}/noProofValueVC.json`, data};
}

async function _validVC(key) {
  const suite = new Ed25519Signature2020({key});
  const signedVC = await vc.issue({
    credential: cloneJSON(credential),
    suite,
    documentLoader
  });
  const title = 'should verify a valid VC with an Ed25519Signature 2020';
  const data = {
    negative: false,
    credential: signedVC,
    row: title,
    title
  };
  return {path: `${credentialsPath}/validVC.json`, data};
}

// run main by calling node ./vc-generator
main();
