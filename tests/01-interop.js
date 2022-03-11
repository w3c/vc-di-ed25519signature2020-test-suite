/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const requests = require('../requests');
const implementations = require('../implementations');

const should = chai.should();
// test these implementations' issuers or verifiers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

describe('Ed25519 2020 Tests', function() {
  const summaries = new Set();
  this.summary = summaries;
  // column names for the matrix go here
  const columnNames = [];
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.columns = columnNames;
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Verifier';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const verifier of testAPIs) {
    // wrap the testApi config in an Implementation class
    const implementation = new Implementation(verifier);
    describe(verifier.name, function() {
      columnNames.push(verifier.name);
      for(const test of requests) {
        it(test.title, async function() {
          this.test.cell = {columnId: verifier.name, rowId: test.row};
          if(test.negative === true) {
            let error;
            let response;
            try {
              response = await implementation.request({...test.request});
            } catch(e) {
              error = e;
            }
            should.not.exist(response, 'Expected API to throw');
            should.exist(error);
            error.status.should.equal(
              test.expected.status,
              `Expected status to be ${test.expected.status}`
            );
          }
          if(test.negative == false) {
            let error;
            let response;
            try {
              response = await implementation.request({...test.request});
            } catch(e) {
              error = e;
            }
            should.exist(response, 'Expected API to return a response');
            should.not.exist(error);
            response.status.should.equal(
              test.expected.status,
              `Expected status to be ${test.expected.status}`
            );
            if(test.expected.data && test.expected.data.length > 0) {
              for(const assertion of test.expected.data) {
                if(typeof assertion === 'string') {
                  response.data.should.have.nested.property(assertion);
                  return;
                }
                response.data.should.nested.include(assertion);
              }
            }
          }
        });
      }
    });
  }
});
