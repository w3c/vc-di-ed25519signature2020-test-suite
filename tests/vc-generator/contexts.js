/*!
 * Copyright (c) 2022-2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
// import {contexts} from '@digitalbazaar/vc';
import credentialsCtx from 'credentials-context';
import didCtx from '@digitalcredentials/did-context';
import ed25519Ctx from 'ed25519-signature-2020-context';

// const credentialExamplesCtx = contexts[
//   'https://www.w3.org/2018/credentials/examples/v1'];
// const odrlCtx = contexts['https://www.w3.org/ns/odrl.jsonld'];

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
// contextMap.set(
//   'https://www.w3.org/2018/credentials/examples/v1',
//   credentialExamplesCtx
// );
// contextMap.set(
//   'https://www.w3.org/ns/odrl.jsonld',
//   odrlCtx
// );

export {contextMap};
