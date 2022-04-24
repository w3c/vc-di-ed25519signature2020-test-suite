/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const {klona} = require('klona');
const {v4: uuidv4} = require('uuid');
const {filterByTag} = require('vc-api-test-suite-implementations');
const {
  checkDataIntegrityProofFormat
} = require('data-integrity-test-suite-assertion');
const {
  getPublicKeyBytes,
  bs58Decode
} = require('./helpers');
const {validVc} = require('../credentials');

// only use implementations with `Ed25519 2020` issuers.
const {match, nonMatch} = filterByTag({issuerTags: ['Ed25519Signature2020']});
const should = chai.should();
const bs58 = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

// multiple test suite names violate max-len
/* eslint-disable max-len */

describe('Ed25519Signature2020 (create)', function() {
  for(const [name, implementation] of match) {
    let verifier;
    let issuedVc;
    let proofs;
    before(async function() {
      const issuer = implementation.issuers.find(issuer =>
        issuer.tags.has('Ed25519Signature2020'));
      verifier = implementation.verifiers.find(verifier =>
        verifier.tags.has('Ed25519Signature2020'));
      const body = {credential: klona(validVc)};
      body.credential.id = `urn:uuid:${uuidv4()}`;
      const {result = {}} = await issuer.issue({body});
      issuedVc = result.data?.verifiableCredential;
      const {proof} = issuedVc || {};
      proofs = Array.isArray(proof) ? proof : [proof];
    });
    describe(name, function() {
      // FIXME move this out so it doesn't accidentally get called multiple times
      checkDataIntegrityProofFormat({vendors: [{getData: () => issuedVc, vendorName: name}]});

      describe('Ed25519Signature2020 (issuer)', function() {
        // column names for the matrix go here
        const columnNames = [];
        // this will tell the report
        // to make an interop matrix with this suite
        this.matrix = true;
        this.report = true;
        this.columns = columnNames;
        this.rowLabel = 'Test Name';
        this.columnLabel = 'Issuer';
        this.notImplemented = [...nonMatch.keys()];
        columnNames.push(name);
        it('`type` field MUST be the string `Ed25519Signature2020`.', function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          proofs.some(proof => proof?.type === 'Ed25519Signature2020').should.equal(
            true,
            'Expected a "proof.type" to be "Ed25519Signature2020"'
          );
        });
        it('`proofValue` field MUST exist and be a Multibase-encoded base58-btc value', function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const multibase = 'z';
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
          'if the public key is 57 bytes in length.', async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          should.exist(issuedVc, 'Expected issuer to have issued a credential.');
          should.exist(proofs, 'Expected credential to have a proof.');
          const ed25519Proofs = proofs.filter(proof => proof?.type === 'Ed25519Signature2020');
          ed25519Proofs.length.should.be.gte(1, 'Expected at least one Ed25519 proof.');
          for(const proof of ed25519Proofs) {
            should.exist(proof.proofValue, 'Expected a proof value on the proof.');
            const valueBytes = bs58Decode({id: proof.proofValue});
            should.exist(proof.verificationMethod);
            const vmBytes = await getPublicKeyBytes({did: proof.verificationMethod});
            vmBytes.byteLength.should.be.oneOf([32, 57], 'Expected public key bytes to be either 32 or 57 bytes.');
            if(vmBytes.byteLength === 32) {
              valueBytes.byteLength.should.equal(64, 'Expected 64 byte proofValue for 32 byte key.');
            } else {
              valueBytes.byteLength.should.equal(114, 'Expected 114 byte proofValue for 57 byte key.');
            }
          }
        });
        it('`proof` MUST verify when using a conformant verifier.', async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title,
          };
          should.exist(verifier, 'Expected implementation to have a VC HTTP API compatible verifier.');
          const {result, error} = await verifier.verify({body: {
            verifiableCredential: issuedVc,
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
