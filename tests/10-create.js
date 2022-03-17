/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const credentials = require('../credentials');
const implementations = require('../implementations');

const should = chai.should();
// test these implementations' issuers or verifiers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

function mock(title) {
  it(title, async ()=>{

  });
}

describe('Ed25519Signature2020 (create)', function() {
  for(const implementer of testAPIs) {
    // wrap the testApi config in an Implementation class
    const implementation = new Implementation(implementer);
    describe(implementer.name, function() {
      describe('Data Integrity', function() {
        mock('`proof` field MUST exist at top-level of data object.');
        mock('`type` field MUST exist and be a string.');
        mock('`created` field MUST exist and be a valid XMLSCHEMA-11 datetime value.');
        mock('`verificationMethod` field MUST exist and be a valid URL.');
        mock('`proofPurpose` field MUST exist and be a string.');
        mock('`proofValue` field MUST exist and be a string');
      });
      describe('Ed25519Signature2020', function() {
        mock('`type` field MUST be the string `Ed25519Signature2020`.');
        mock('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value');
        mock('`proofValue` field, when decoded to raw bytes, MUST be 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length.');
        mock('proof MUST verify when using a conformant verifier.');
      });
      describe('eddsa-2022 cryptosuite', function() {
        mock('`type` field MUST be the string `DataIntegritySignature`.');
        mock('`cryptosuite` field MUST exist and be the string `eddsa-2022`.');
        mock('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value');
        mock('`proofValue` field, when decoded to raw bytes, MUST be 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length.');
        mock('proof MUST verify when using a conformant verifier.');
      });
    });
  }
});
