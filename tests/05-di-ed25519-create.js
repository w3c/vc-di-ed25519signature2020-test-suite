/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {
  checkDataIntegrityProofFormat
} from 'data-integrity-test-suite-assertion';
import {endpoints} from 'vc-test-suite-implementations';
import {tag} from './test-config.js';

// only use implementations with `Ed25519 2020` issuers.
const {match} = endpoints.filterByTag({tags: [tag], property: 'issuers'});

checkDataIntegrityProofFormat({
  implemented: match, tag,
  expectedProofTypes: ['Ed25519Signature2020'],
  expectedCryptoSuite: false
});

