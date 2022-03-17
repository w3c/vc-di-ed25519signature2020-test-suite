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

describe('Ed25519Signature2020 (verify)', function() {
  for(const implementer of testAPIs) {
    // wrap the testApi config in an Implementation class
    const implementation = new Implementation(implementer);
    describe(implementer.name, function() {
      describe('Data Integrity', function() {
        mock('If the `proof` field is missing or invalid a MALFORMED error MUST be returned.');
        mock('If the `type` field is missing or invalid a MALFORMED error MUST be returned.');
        mock('If the `created` field is missing or invalid a MALFORMED error MUST be returned.');
        mock('If the `verificatioNMethod` field is missing or invalid a MALFORMED error MUST be returned.');
        mock('If the `proofPurpose` field is missing or invalid a MALFORMED error MUST be returned.');
        mock('If the `proofValue` field is missing or invalid a MALFORMED error MUST be returned.');
      });
      describe('Ed25519Signature2020', function() {
        mock('If the `type` field is not the string `Ed25519Signature2020`, a UNKNOWN_CRYPTOSUITE_TYPE error MUST be returned.');
        mock('If the `proofValue` field is not a Multibase-encoded base58-btc value, an INVALID_PROOF_VALUE error MUST be returned.');
        mock('If the `proofValue` field, when decoded to raw bytes, is not 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length, an INVALID_PROOF_LENGTH error MUST be returned.');
        mock('If a canonicalization algorithm other than URDNA2015 is used, a INVALID_PROOF_VALUE error MUST be returned.');
        mock('If a canonicalization data hashing algorithm SHA-2-256 is used, a INVALID_PROOF_VALUE error MUST be returned.');
      });
      describe('eddsa-2022 cryptosuite', function() {
        mock('If the `type` field is not the string `DataIntegritySignature`, a UNKNOWN_PROOF_TYPE error MUST be returned.');
        mock('If the `cryptosuite` field is not the string `eddsa-2022`, a UNKNOWN_CRYPTOSUITE_TYPE error MUST be returned.');
        mock('If the `proofValue` field is not a Multibase-encoded base58-btc value, an INVALID_PROOF_VALUE error MUST be returned.');
        mock('If the `proofValue` field, when decoded to raw bytes, is not 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length, an INVALID_PROOF_LENGTH error MUST be returned.');
        mock('If a canonicalization algorithm other than URDNA2015 is used, a INVALID_PROOF_VALUE error MUST be returned.');
        mock('If a canonicalization data hashing algorithm SHA-2-256 is used, a INVALID_PROOF_VALUE error MUST be returned.');
      });
    });
  }
});
