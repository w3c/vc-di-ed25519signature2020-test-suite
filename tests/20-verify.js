/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {implementations} = require('vc-api-test-suite-implementations');
const {verificationFail} = require('./assertions');
const {
  issuedVC,
  canonizeJCS: incorrectCannonization,
  digestSha512: incorrectHash
} = require('../credentials');
const {deepClone} = require('./helpers');

// multiple test suite names violate max-len
/* eslint-disable max-len */

describe('Ed25519Signature2020 (verify)', function() {
  for(const [name, implementation] of implementations) {
    // wrap the testApi config in an Implementation class
    const verifier = implementation.verifiers.find(verifier =>
      verifier.tags.has('VC-HTTP-API'));
    describe(name, function() {
      describe('Data Integrity', function() {
        it('If the `proof` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof;
          await verificationFail({credential, verifier});
        });
        it('If the `type` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof.type;
          await verificationFail({credential, verifier});
        });
        it('If the `created` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof.created;
          await verificationFail({credential, verifier});
        });
        it('If the `verificationMethod` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof.verificationMethod;
          await verificationFail({credential, verifier});
        });
        it('If the `proofPurpose` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof.proofPurpose;
          await verificationFail({credential, verifier});
        });
        it('If the `proofValue` field is missing or invalid a MALFORMED error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          delete credential.proof.proofValue;
          await verificationFail({credential, verifier});
        });
      });
      describe('Ed25519Signature2020', function() {
        it('If the `type` field is not the string `Ed25519Signature2020`, a UNKNOWN_CRYPTOSUITE_TYPE error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          credential.proof.type = 'UnknownCryptoSuite';
          await verificationFail({credential, verifier});
        });
        it('If the `proofValue` field is not a Multibase-encoded base58-btc value, an INVALID_PROOF_VALUE error MUST be returned.', async function() {
          const credential = deepClone(issuedVC);
          credential.proof.proofValue = 'not-multibase-bs58-encoded!!';
          await verificationFail({credential, verifier});
        });
        it('If the `proofValue` field, when decoded to raw bytes, is not 64 bytes in length if the associated public key is 32 bytes in length, or 114 bytes in length if the public key is 57 bytes in length, an INVALID_PROOF_LENGTH error MUST be returned.', async function() {
          throw new Error('IMPLEMENT THIS TEST');
        });
        it('If a canonicalization algorithm other than URDNA2015 is used, a INVALID_PROOF_VALUE error MUST be returned.', async function() {
          const credential = deepClone(incorrectCannonization);
          await verificationFail({credential, verifier});
        });
        it('If a canonicalization data hashing algorithm SHA-2-256 is used, a INVALID_PROOF_VALUE error MUST be returned.', async function() {
          const credential = deepClone(incorrectHash);
          await verificationFail({credential, verifier});
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
