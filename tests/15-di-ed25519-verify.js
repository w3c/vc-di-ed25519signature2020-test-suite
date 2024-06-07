import {
  checkDataIntegrityProofVerifyErrors
} from 'data-integrity-test-suite-assertion';
import {endpoints} from 'vc-test-suite-implementations';
import {tag} from './test-config.js';

// only use implementations with `Ed25519 2020` verifiers.
const {match} = endpoints.filterByTag({
  tags: [tag],
  property: 'verifiers'
});

checkDataIntegrityProofVerifyErrors({
  implemented: match,
  expectedProofType: 'Ed25519Signature2020'
});
