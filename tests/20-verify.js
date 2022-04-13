/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const {implementations} = require('vc-api-test-suite-implementations');
const validVC = require('./validVC.json');

// multiple test suite names violate max-len
/* eslint-disable max-len */

const should = chai.should();

describe.skip('Ed25519Signature2020 (verify)', function() {
  for(const [name, implementation] of implementations) {
    // wrap the testApi config in an Implementation class
    const verifier = implementation.verifiers.find(verifier =>
      verifier.tags.has('VC-HTTP-API'));
    describe(name, function() {
      describe('Data Integrity', function() {
        it('If the `proof` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
        it('If the `type` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
        it('If the `created` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
        it('If the `verificatioNMethod` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
        it('If the `proofPurpose` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
        it('If the `proofValue` field is missing or invalid a MALFORMED error MUST be returned.', async function() {

        });
      });
      describe('Ed25519Signature2020', function() {
        it('If the `type` field is not the string `Ed25519Signature2020`, a UNKNOWN_CRYPTOSUITE_TYPE error MUST be returned.', async function() {

        });
        it('If the `proofValue` field is not a Multibase-encoded base58-btc value, an INVALID_PROOF_VALUE error MUST be returned.', async function() {

        });
        it('If the `proofValue` field, when decoded to raw bytes, is not 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length, an INVALID_PROOF_LENGTH error MUST be returned.', async function() {

        });
        it('If a canonicalization algorithm other than URDNA2015 is used, a INVALID_PROOF_VALUE error MUST be returned.', async function() {

        });
        it('If a canonicalization data hashing algorithm SHA-2-256 is used, a INVALID_PROOF_VALUE error MUST be returned.', async function() {

        });
      });
      describe.skip('eddsa-2022 cryptosuite', function() {
        it('If the `type` field is not the string `DataIntegritySignature`, a UNKNOWN_PROOF_TYPE error MUST be returned.');
        it('If the `cryptosuite` field is not the string `eddsa-2022`, a UNKNOWN_CRYPTOSUITE_TYPE error MUST be returned.');
        it('If the `proofValue` field is not a Multibase-encoded base58-btc value, an INVALID_PROOF_VALUE error MUST be returned.');
        it('If the `proofValue` field, when decoded to raw bytes, is not 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length, an INVALID_PROOF_LENGTH error MUST be returned.');
        it('If a canonicalization algorithm other than URDNA2015 is used, a INVALID_PROOF_VALUE error MUST be returned.');
        it('If a canonicalization data hashing algorithm SHA-2-256 is used, a INVALID_PROOF_VALUE error MUST be returned.');
      });
    });
  }
});
