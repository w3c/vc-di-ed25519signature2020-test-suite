/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const {v4: uuidv4} = require('uuid');
const httpsAgent = new https.Agent({rejectUnauthorized: false});
const {httpClient} = require('@digitalbazaar/http-client');
const {ISOTimeStamp} = require('./helpers');

const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  async issue({credential, headers = {}, options = {}}) {
    try {
      const headers = {..._headers, ...headers};
      const expires = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 2);
        return ISOTimeStamp({date});
      };
      const body = {
        credential: {
          ...credential,
          id: `urn:uuid:${uuidv4()}`,
          issuanceDate: ISOTimeStamp(),
          expirationDate: expires(),
          issuer: this.settings.issuer.id,
          '@context': credential['@context']
        },
        options
      };
      const result = await httpClient.post(
        this.settings.issuer.endpoint,
        {headers, agent: httpsAgent, json: body}
      );
      return result;
    } catch(e) {
      // this is just to make debugging easier
      //console.error(e);
      throw e;
    }
  }
  async verify({body, headers = {}}) {
        try {
      const headers = {..._headers, ...headers};
      const result = await httpClient.post(
        this.settings.verifier,
        {headers, agent: httpsAgent, json: body}
      );
      return result;
    } catch(e) {
      // this is just to make debugging easier
      if(e && e.response && e.response.data) {
        throw new Error(JSON.stringify(e.response.data, null, 2));
      }
      throw e;
    }
  }
}

module.exports = Implementation;
