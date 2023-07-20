/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {bs58Decode, bs58Encode} from './helpers.js';
import {verificationFail, verificationSuccess} from './assertions.js';
import {
  checkDataIntegrityProofVerifyErrors
} from 'data-integrity-test-suite-assertion';
import {endpoints} from 'vc-api-test-suite-implementations';
import {generateTestData} from './vc-generator/index.js';
import {klona} from 'klona';

// only use implementations with `Ed25519 2020` verifiers.
const {match} = endpoints.filterByTag({
  tags: ['Ed25519Signature2020'],
  property: 'verifiers'
});

describe('Ed25519Signature2020 (verify)', function() {
  let issuedVc;
  let incorrectCannonization;
  let incorrectHash;
  before(async function() {
    const credentials = await generateTestData();
    issuedVc = credentials.get('issuedVc');
    incorrectCannonization = credentials.get('canonizeJcs');
    incorrectHash = credentials.get('digestSha512');
  });
  checkDataIntegrityProofVerifyErrors({
    implemented: match,
    expectedProofType: 'Ed25519Signature2020'
  });

  describe('Ed25519Signature2020 (verifier)', function() {
    // this will tell the report
    // to make an interop matrix with this suite
    this.matrix = true;
    this.report = true;
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Verifier';
    this.implemented = [...match.keys()];

    for(const [name, {implementation}] of match) {
      describe(name, function() {
        const verifier = implementation.verifiers.find(
          verifier => verifier.tags.has('Ed25519Signature2020'));
        it('MUST verify a valid VC with an Ed25519Signature2020 proof',
          async function() {
            this.test.cell = {
              columnId: name,
              rowId: this.test.title
            };
            const credential = klona(issuedVc);
            await verificationSuccess({credential, verifier});
          });
        it('If the "proofValue" field, when decoded to raw bytes, is not ' +
          '64 bytes in length if the associated public key is 32 bytes ' +
          'in length, or 114 bytes in length if the public key is 57 bytes ' +
          'in length, an INVALID_PROOF_LENGTH error MUST be returned.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const credential = klona(issuedVc);
          const proofBytes = bs58Decode({id: credential.proof.proofValue});
          const randomBytes = new Uint8Array(32).map(
            () => Math.floor(Math.random() * 255));
          credential.proof.proofValue = bs58Encode(
            new Uint8Array([...proofBytes, ...randomBytes]));
          await verificationFail({credential, verifier});
        });
        it('If a canonicalization algorithm other than URDNA2015 is used, ' +
          'a INVALID_PROOF_VALUE error MUST be returned.', async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const credential = klona(incorrectCannonization);
          await verificationFail({credential, verifier});
        });
        it('If a canonicalization data hashing algorithm SHA-2-256 is used, ' +
          'a INVALID_PROOF_VALUE error MUST be returned.', async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const credential = klona(incorrectHash);
          await verificationFail({credential, verifier});
        });
      });
    }
  });
});
