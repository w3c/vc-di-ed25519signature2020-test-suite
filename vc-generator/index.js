/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const {join} = require('path');
const {
  cloneJSON,
  getDiDKey,
  writeJSON
} = require('./helpers');
const credential = require('./testVC');
const Ed25519Signature2020 = require('./TestEd25519Signature2020');
const vc = require('@digitalbazaar/vc');
const documentLoader = require('./documentLoader');
const {hashDigest} = require('./hashDigest');

const credentialsPath = join(process.cwd(), 'credentials');

// this will generate the signed VCs for the test
const main = async () => {
  const {methodFor} = await getDiDKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  const validVC = await _validVC(key);
  await Promise.all([
    _noProofValue(validVC),
    _noProofPurpose(validVC),
    _noProofCreated(validVC),
    _noProofType(validVC),
    _incorrectDigest(key),
    _incorrectCanonize(key)
  ]);
};

async function _incorrectCanonize(key) {
  const suite = new Ed25519Signature2020({
    key,
    canonizeAlgorithm: 'URGNA2012'
  });
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
  await writeJSON({path: `${credentialsPath}/canonizeURGNA2012.json`, data});
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
  await writeJSON({path: `${credentialsPath}/digestSha512.json`, data});
}

async function _noProofType(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.type;
  const title = 'should not verify a proof with out a type';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  await writeJSON({path: `${credentialsPath}/noProofType.json`, data});
}

async function _noProofCreated(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.created;
  const title = 'should not verify a proof with out a created';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  await writeJSON({path: `${credentialsPath}/noProofCreatedVC.json`, data});
}

async function _noProofPurpose(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.proofPurpose;
  const title = 'should not verify a proof with out a proofPurpose';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  await writeJSON({path: `${credentialsPath}/noProofPurposeVC.json`, data});
}

async function _noProofValue(credential) {
  const copy = cloneJSON(credential);
  delete copy.proof.proofValue;
  const title = 'should not verify a proof with out a proofValue';
  const data = {
    negative: true,
    credential: copy,
    row: title,
    title
  };
  await writeJSON({path: `${credentialsPath}/noProofValueVC.json`, data});
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
  await writeJSON({path: `${credentialsPath}/validVC.json`, data});
  return signedVC;
}

// run main by calling node ./vc-generator
main();
