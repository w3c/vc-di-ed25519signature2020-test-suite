/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import {contextMap} from './contexts.js';
const jdl = new JsonLdDocumentLoader();

// add contexts to documentLoad
for(const [key, value] of contextMap) {
  jdl.addStatic(key, value);
}

export default jdl.build();
