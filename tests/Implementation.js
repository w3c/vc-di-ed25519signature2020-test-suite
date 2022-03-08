/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const httpsAgent = new https.Agent({rejectUnauthorized: false});
const {httpClient} = require('@digitalbazaar/http-client');

const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  async request({body, headers, url, method}) {
    try {
      const result = await httpClient(url, {
        method,
        headers: {..._headers, ...headers},
        agent: httpsAgent,
        json: body
      }
      );
      return result;
    } catch(e) {
      //console.error(e);
      // this is just to make debugging easier
      if(e && e.response && e.response.data) {
        throw new Error(JSON.stringify(e.response.data, null, 2));
      }
      throw e;
    }
  }
  async request({body, headers, url, method}) {
    try {
      const result = await httpClient(url, {
        method,
        headers: {..._headers, ...headers},
        agent: httpsAgent,
        json: body
      }
      );
      return result;
    } catch(e) {
      console.error(e);
      // this is just to make debugging easier
      if(e && e.response && e.response.data) {
        throw new Error(JSON.stringify(e.response.data, null, 2));
      }
      throw e;
    }
  }
}

module.exports = Implementation;
