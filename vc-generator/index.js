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
const {join} = require('path');

const credentialsPath = join(process.cwd(), 'credentials');

// this will generate the signed VCs for the test
const main = async () => {
  const {methodFor} = await getDiDKey();
  const key = methodFor({purpose: 'capabilityInvocation'});
  await _validVC(key);
};

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
}

// run main by calling node ./vc-generator
main();
