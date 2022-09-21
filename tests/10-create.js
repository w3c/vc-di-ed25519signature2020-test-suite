/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {bs58Decode, getPublicKeyBytes} from './helpers.js';
import chai from 'chai';
import {
  checkDataIntegrityProofFormat
} from 'data-integrity-test-suite-assertion';
import {filterByTag} from 'vc-api-test-suite-implementations';
import {generateTestData} from './vc-generator/index.js';
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';
// only use implementations with `Ed25519 2020` issuers.
const tag = 'Ed25519Signature2020';
const {match, nonMatch} = filterByTag({tags: [tag], property: 'issuers'});
const should = chai.should();
const bs58 = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

describe('Ed25519Signature2020 (create)', function() {
  let validVc;
  before(async function() {
    const credentials = await generateTestData();
    validVc = credentials.get('validVc');
  });
  checkDataIntegrityProofFormat(
    {implemented: match, notImplemented: nonMatch, tag});

  describe('Ed25519Signature2020 (issuer)', function() {
    // this will tell the report
    // to make an interop matrix with this suite
    this.matrix = true;
    this.report = true;
    this.implemented = [...match.keys()];
    this.notImplemented = [...nonMatch.keys()];
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Issuer';
    for(const [name, implementation] of match) {
      describe(name, function() {
        let verifier;
        let issuedVc;
        let proofs;
        before(async function() {
          const issuer = implementation.issuers.find(
            issuer => issuer.tags.has('Ed25519Signature2020'));
          verifier = implementation.verifiers.find(
            verifier => verifier.tags.has('Ed25519Signature2020'));
          const {settings: {id: issuerId, options}} = issuer;
          const body = {credential: klona(validVc), options};
          body.credential.id = `urn:uuid:${uuidv4()}`;
          body.credential.issuer = issuerId;
          const {data} = await issuer.post({json: body});
          issuedVc = data;
          const {proof} = issuedVc || {};
          proofs = Array.isArray(proof) ? proof : [proof];
        });
        it('"type" field MUST be the string "Ed25519Signature2020".',
          function() {
            this.test.cell = {
              columnId: name,
              rowId: this.test.title
            };
            proofs.some(
              proof => proof?.type === 'Ed25519Signature2020').should.equal(
              true,
              'Expected "proof.type" to be "Ed25519Signature2020"'
            );
          });
        it('"proofValue" field MUST exist and be a multibase-encoded ' +
          'base58-btc encoded value', function() {
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
            'Expected "proof.proofValue" to be multibase-encoded base58-btc ' +
            'value.'
          );
        });
        it('"proofValue" field when decoded to raw bytes, MUST be 64 bytes ' +
          'in length if the associated public key is 32 bytes or 114 bytes ' +
          'in length if the public key is 57 bytes.', async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          should.exist(issuedVc, 'Expected issuer to have issued a ' +
            'credential.');
          should.exist(proofs, 'Expected credential to have a proof.');
          const ed25519Proofs = proofs.filter(
            proof => proof?.type === 'Ed25519Signature2020');
          ed25519Proofs.length.should.be.gte(1, 'Expected at least one ' +
            'Ed25519 proof.');
          for(const proof of ed25519Proofs) {
            should.exist(proof.proofValue, 'Expected a proof value on ' +
              'the proof.');
            const valueBytes = bs58Decode({id: proof.proofValue});
            should.exist(proof.verificationMethod);
            const vmBytes = await getPublicKeyBytes({
              did: proof.verificationMethod});
            vmBytes.byteLength.should.be.oneOf([32, 57], 'Expected public ' +
              'key bytes to be either 32 or 57 bytes.');
            if(vmBytes.byteLength === 32) {
              valueBytes.byteLength.should.equal(64, 'Expected 64 bytes ' +
                'proofValue for 32 bytes key.');
            } else {
              valueBytes.byteLength.should.equal(114, 'Expected 114 bytes ' +
                'proofValue for 57 bytes key.');
            }
          }
        });
        it('"proof" MUST verify when using a conformant verifier.',
          async function() {
            this.test.cell = {
              columnId: name,
              rowId: this.test.title,
            };
            should.exist(verifier, 'Expected implementation to have a VC ' +
              'HTTP API compatible verifier.');
            const {result, error} = await verifier.post({json: {
              verifiableCredential: issuedVc,
              options: {checks: ['proof']}
            }});
            should.not.exist(error, 'Expected verifier to not error.');
            should.exist(result, 'Expected verifier to return a result.');
            result.status.should.not.equal(400, 'Expected status code to not ' +
              'be 400.');
            result.status.should.equal(200, 'Expected status code to be 200.');
          });
      });
    }
  });
  // FIXME implement once library is ready
  describe.skip('eddsa-2022 cryptosuite', function() {
    it('"type" field MUST be the string "DataIntegritySignature".');
    it('"cryptosuite" field MUST exist and be the string `eddsa-2022`.');
    it('"proofValue" field MUST exist and be a multibase-encoded base58-btc ' +
      'value', function() {

    });
    it('"proofValue" field, when decoded to raw bytes, MUST be 64 bytes ' +
      'in length if the associated public key is 32 bytes in length, or ' +
      '114 bytes in length if the public key is 57 bytes ' +
      'in length.', function() {

    });
    it('proof MUST verify when using a conformant verifier.', async function() {

    });
  });
});
