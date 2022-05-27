/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const ed25519Ctx = require('ed25519-signature-2020-context');
const didCtx = require('@digitalcredentials/did-context');
const credentialsCtx = require('credentials-context');
const credentialExamplesCtx = require(
  '@digitalbazaar/vc/lib/contexts/vc-examples-v1');
const odrlCtx = require(
  '@digitalbazaar/vc/lib/contexts/odrl');

const contextMap = new Map();

// add contexts for the documentLoader
contextMap.set(ed25519Ctx.constants.CONTEXT_URL, ed25519Ctx.CONTEXT);
contextMap.set(
  didCtx.constants.DID_CONTEXT_URL,
  didCtx.contexts.get(
    didCtx.constants.DID_CONTEXT_URL)
);
contextMap.set(
  credentialsCtx.constants.CONTEXT_URL,
  credentialsCtx.contexts.get(
    credentialsCtx.constants.CONTEXT_URL)
);
contextMap.set(
  'https://www.w3.org/2018/credentials/examples/v1',
  credentialExamplesCtx
);
contextMap.set(
  'https://www.w3.org/ns/odrl.jsonld',
  odrlCtx
);

module.exports = {contextMap};
