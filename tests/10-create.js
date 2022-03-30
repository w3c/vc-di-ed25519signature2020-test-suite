/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const credentials = require('../credentials');
const implementations = require('../implementations');
const validVC = require('./validVC.json');

const should = chai.should();
// test these implementations' issuers or verifiers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

describe('Ed25519Signature2020 (create)', function() {
  for(const implementer of testAPIs) {
    // wrap the testApi config in an Implementation class
    const implementation = new Implementation(implementer);
    describe(implementer.name, function() {
      let issuedVC;
      before(async function() {
        const body = {credential: validVC};
        issuedVC = await implementation.request({body});
      });
      describe('Data Integrity', function() {
        it('`proof` field MUST exist at top-level of data object.');
        it('`type` field MUST exist and be a string.');
        it('`created` field MUST exist and be a valid XMLSCHEMA-11 datetime value.');
        it('`verificationMethod` field MUST exist and be a valid URL.');
        it('`proofPurpose` field MUST exist and be a string.');
        it('`proofValue` field MUST exist and be a string');
      });
      describe('Ed25519Signature2020', function() {
        it('`type` field MUST be the string `Ed25519Signature2020`.', function() {

        });
        it('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value', function() {

        });
        it('`proofValue` field, when decoded to raw bytes, MUST be 64 bytes in length ' +
          'if the associated public key is 32 bytes in length, or 114 bytes in length ' +
          'if the public key is 57 bytes in length.', function() {

        });
        it('proof MUST verify when using a conformant verifier.');
      });
      describe('eddsa-2022 cryptosuite', function() {
        it('`type` field MUST be the string `DataIntegritySignature`.');
        it('`cryptosuite` field MUST exist and be the string `eddsa-2022`.');
        it('`proofValue` field MUST exist and be a Multibase-encoded ' +
            'base58-btc value', function() {

        });
        it('`proofValue` field, when decoded to raw bytes, MUST be 64' +
          'bytes in length if the associated public key is 32 bytes in ' +
          'length, or 114 bytes in length if the public key is 57 bytes' +
            ' in length.', function() {

        });
        it('proof MUST verify when using a conformant verifier.', async function() {

        });
      });
    });
  }
});
