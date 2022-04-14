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
const {filterMap} = require('./helpers');

const predicate = ({value}) =>
  value.issuers.some(issuer => issuer.tags.has('Ed25519Signature2020'));
// only use implementations that use `Ed25519 2020`
const filtered = filterMap({map: implementations, predicate});
const should = chai.should();

// multiple test suite names violate max-len
/* eslint-disable max-len */

describe('Ed25519Signature2020 (create)', function() {
  for(const [name, implementation] of filtered) {
    let verifier;
    let issuedVC;
    let proofs;
    before(async function() {
      const issuer = implementation.issuers.find(issuer =>
        issuer.tags.has('Ed25519Signature2020'));
      verifier = implementation.verifiers.find(verifier =>
        verifier.tags.has('VC-HTTP-API'));
      const body = {credential: {...validVC}};
      const {result = {}} = await issuer.issue({body});
      issuedVC = result.data?.verifiableCredential;
      const {proof} = issuedVC || {};
      proofs = Array.isArray(proof) ? proof : [proof];
    });
    describe(name, function() {

      checkDataIntegrityProofFormat({getData: () => issuedVC, vendorName: name, proofs});

      describe('Ed25519Signature2020', function() {
        it('`type` field MUST be the string `Ed25519Signature2020`.', function() {
          proofs.some(proof => proof?.type === 'Ed25519Signature2020').should.equal(
            true,
            'Expected a "proof.type" to be "Ed25519Signature2020"'
          );
        });
        it('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value', function() {
          const multibase = 'z';
          const bs58 = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
          proofs.some(proof => {
            const value = proof?.proofValue || '';
            return value.startsWith(multibase) && bs58.test(value);
          }).should.equal(
            true,
            'Expected a "proof.proofValue" to be multibase-encoded base58-btc value.'
          );
        });
        it('`proofValue` field, when decoded to raw bytes, MUST be 64 bytes in length ' +
          'if the associated public key is 32 bytes in length, or 114 bytes in length ' +
          'if the public key is 57 bytes in length.', function() {
             throw new Error('IMPLEMENT THIS TEST');
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
      // FIXME implement once library is ready
      describe.skip('eddsa-2022 cryptosuite', function() {
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
