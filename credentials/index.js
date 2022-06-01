/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const requireDir = require('require-dir');

const dir = requireDir('.');

export default dir;
