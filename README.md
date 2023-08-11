# [Ed25519Signature2020](https://www.w3.org/TR/vc-di-eddsa/#the-ed25519signature2020-suite) Cryptosuite Test Suite

## Table of Contents

- [Ed25519Signature2020 Cryptosuite Test Suite](#ed25519signature2020-cryptosuite-test-suite)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
  - [Implementation](#implementation)
  - [Docker Integration (TODO)](#docker-integration-todo)
  - [Contribute](#contribute)
  - [License](#license)

## Background
Provides interoperability tests for verifiable credential processors
(issuers and verifiers) that support [Ed25519Signature2020](https://www.w3.org/TR/vc-di-eddsa/#the-ed25519signature2020-suite).

## Install

```js
npm i
```

## Usage

```
npm test
```

## Implementation

You will need an issuer and verifier that are conformant to the
[VC API](https://w3c-ccg.github.io/vc-api/)
and are capable of handling issuance and verification of Verifiable Credentials
with the `Ed25519Signature2020` proof type.

To add your implementation to this test suite, you will need to add 2 endpoints
to your implementation manifest:
- A credential issuer endpoint (`/credentials/issue`) in the `issuers`
  property.
- A credential verifier endpoint (`/credentials/verify`) in the `verifiers`
  property.

All endpoints will need the tag `Ed25519Signature2020`.

A simplified manifest would look like this:

```js
{
  "name": "My Company",
  "implementation": "My implementation",
  "issuers": [{
    "id": "",
    "endpoint": "https://mycompany.example/credentials/issue",
    "method": "POST",
    "tags": ["Ed25519Signature2020"]
  }],
  "verifiers": [{
    "id": "",
    "endpoint": "https://mycompany.example/credentials/verify",
    "method": "POST",
    "tags": ["Ed25519Signature2020"]
  }]
}
```

The example above represents an unauthenticated endpoint. You may add ZCAP or
OAuth2 authentication to your endpoints. You can find an example in the
[vc-test-suite-implementations README](https://github.com/w3c/vc-test-suite-implementations#adding-a-new-implementation).

To run the tests, some implementations may require client secrets that can be
passed as environment variables to the test script. To see which implementations
require client secrets, please check the implementation manifest within the
[vc-api-test-suite-implementations](https://github.com/w3c/vc-test-suite-implementations/tree/main/implementations) library.

## Docker Integration (TODO)

We are presently working on implementing a new feature that will enable the
use of Docker images instead of live endpoints. The Docker image that you
provide will be started when the test suite is run. The image is expected to
expose the API provided above, which will be used in the same way that live
HTTP endpoints are used above.

## Contribute

See [the CONTRIBUTING.md file](CONTRIBUTING.md).

Pull Requests are welcome!

## License

See [the LICENSE.md file](LICENSE.md)
