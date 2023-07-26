# di-ed25519signature2020-test-suite

> Test Suite for [Ed25519Signature2020](https://w3c-ccg.github.io/lds-ed25519-2020/).

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Implementation](#implementation)
- [Docker Integration](#docker-integration-todo)
- [License](#license)

## Background
Provides interoperability tests for verifiable credential processors
(issuers/verifiers) that support [Ed25519Signature2020](https://w3c-ccg.github.io/lds-ed25519-2020/).

## Install

```js
npm i
```

## Usage

```
npm test
```

## Implementation

You will need an issuer and verifier that are compatible with [VC API](https://w3c-ccg.github.io/vc-api/)
and are capable of handling issuance and verification of Verifiable Credentials
with `Ed25519Signature2020` proof type.

To add your implementation to this test suite, you will need to add 2 endpoints
to your implementation manifest.
- A credentials issuer endpoint (`/credentials/issue`) in the `issuers`
  property.
- A credentials verifier endpoint (`/credentials/verify`) in the `verifiers`
  property.

All endpoints will need the tag `Ed25519Signature2020`.

A simplified manifest would look like this:

```js
{
  "name": "My Company",
  "implementation": "My implementation",
  "issuers": [{
    "id": "",
    "endpoint": "https://issuer.mycompany.com/credentials/issue",
    "method": "POST",
    "tags": ["Ed25519Signature2020"]
  }],
  "verifiers": [{
    "id": "",
    "endpoint": "https://verifier.mycompany.com/credentials/verify",
    "method": "POST",
    "tags": ["Ed25519Signature2020"]
  }]
}
```

The example above represents an unauthenticated endpoint. You may add zcap or
oauth authentication to your endpoints. You can find an example in the
[vc-api-test-suite-implementations README here](https://github.com/w3c-ccg/vc-api-test-suite-implementations#adding-a-new-implementation).

To run the tests, some implementations may require client secrets that can be
passed as env variables to the test script. To see which ones require client
secrets, please check the implementation manifest within the
[vc-api-test-suite-implementations](https://github.com/w3c-ccg/vc-api-test-suite-implementations/tree/main/implementations) library.

## Docker Integration (TODO)

We are presently working on implementing a new feature that will enable the
utilization of Docker images instead of live endpoints. The docker image that
you provide will be started when the test suite is run. The image is expected
to expose the API provided above, which will be utilized in the same way that
live HTTP endpoints are used above.

## License

Copyright © 2023 [World Wide Web Consortium](http://www.w3.org/), ([MIT](http://www.csail.mit.edu/), [ERCIM](http://www.ercim.org/), [Keio](http://www.keio.ac.jp/), [Beihang](http://ev.buaa.edu.cn/)) and others. All Rights Reserved. <http://www.w3.org/Consortium/Legal/2008/04-testsuite-copyright.html>

Distributed under both the [W3C Test Suite License](https://www.w3.org/Consortium/Legal/2008/04-testsuite-license) (SPDX: [LicenseRef-scancode-w3c-test-suite](https://scancode-licensedb.aboutcode.org/w3c-test-suite.html)) and the [W3C 3-clause BSD License](https://www.w3.org/Consortium/Legal/2008/03-bsd-license). To contribute to a W3C Test Suite, see the [policies and contribution forms](https://www.w3.org/2004/10/27-testcases).

UNDER BOTH MUTUALLY EXCLUSIVE LICENSES, THIS DOCUMENT AND ALL DOCUMENTS, TESTS AND SOFTWARE THAT LINK THIS STATEMENT ARE PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR TITLE; THAT THE CONTENTS OF THE DOCUMENT ARE SUITABLE FOR ANY PURPOSE; NOR THAT THE IMPLEMENTATION OF SUCH CONTENTS WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.

COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE DOCUMENT OR THE PERFORMANCE OR IMPLEMENTATION OF THE CONTENTS THEREOF.
