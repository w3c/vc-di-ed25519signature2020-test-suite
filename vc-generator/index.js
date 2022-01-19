/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const {
  cloneJSON,
  getDiDKey,
  writeJSON
} = require('./helpers');
const credential = require('./testVC');
const Ed25519Signature2020 = require('./TestEd25519Signature2020');
const vc = require('@digitalbazaar/vc');
const documentLoader = require('./documentLoader');

// this will generate the signed VCs for the test
const main = async () => {
  const {methodFor} = await getDiDKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  const suite = new Ed25519Signature2020({key});
  const signedVC = await vc.issue({
    credential: cloneJSON(credential),
    suite,
    documentLoader
  });
  console.log(JSON.stringify(signedVC, null, 2));
};

// run main by calling node ./vc-generator
main();
