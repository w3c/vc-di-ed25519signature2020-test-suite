/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const {implementations} = require('vc-api-test-suite-implementations');
const validVC = require('./validVC.json');
const {
  checkDataIntegrityProofFormat
} = require('data-integrity-test-suite-assertion');

const should = chai.should();

// multiple test suite names violate max-len
/* eslint-disable max-len */

describe('Ed25519Signature2020 (create)', function() {
  for(const [name, implementation] of implementations) {
    const issuer = implementation.issuers.find(issuer =>
      issuer.tags.has('Ed255192020'));
    const verifier = implementation.verifiers.find(verifier =>
      verifier.tags.has('VC-HTTP-API'));
    // if an implementation has no issuer that use the Ed25519 2020 Suite
    // don't use it.
    if(!issuer) {
      return;
    }
    describe(name, function() {
      let issuedVC;
      before(async function() {
        const body = {credential: {...validVC}};
        issuedVC = await issuer.issue({body});
      });
      // run data integrity test suite
      checkDataIntegrityProofFormat({data: issuedVC, vendorName: name});

      describe('Ed25519Signature2020', function() {
        const {proof} = issuedVC;
        const proofs = Array.isArray(proof) ? proof : [proof];
        it('`type` field MUST be the string `Ed25519Signature2020`.', () => {
          proofs.some(proof => proof?.type === 'Ed25519Signature2020').to.equal(
            true,
            'Expected a "proof.type" to be "Ed25519Signature2020"'
          );
        });
        it('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value', function() {
          const bs58Multibase = 'z6Mk';
          proofs.some(proof => proof?.proofValue.startsWith(bs58Multibase)).to.equal(
            true,
            'Expected a "proof.proofValue" to be bs58 multibase-encoded.'
          );
        });
        it('`proofValue` field, when decoded to raw bytes, MUST be 64 bytes in length ' +
          'if the associated public key is 32 bytes in length, or 114 bytes in length ' +
          'if the public key is 57 bytes in length.', function() {

        });
        it('proof MUST verify when using a conformant verifier.', async function() {
          const {result, error} = await verifier.verify({body: {
            verifiableCredential: issuedVC,
            options: {checks: ['proof']}
          }});
          should.not.exist(error, 'Expected verifier to not error.');
          should.exist(result, 'Expected verifier to return a result.');
          result.status.should.not.equal(400, 'Expected status to not be 400.');
          result.status.should.equal(200, 'Expected status to be 200.');
        });
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
