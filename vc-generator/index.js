/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const {
  getDiDKey,
  writeJSON
} = require('./helpers');
const vc = require('testVC');

// this will generate the signed VCs for the test
const main = async () => {
  const key = await getDiDKey();
};

// run main by calling node ./vc-generator
main();
