# Ed25519Signature2020 Interoperability Test Suite

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Generator](#generator)
- [Implementation](#implementation)


## Background

Provides interoperability tests for verifiers that support [Ed25519Signature2020](https://w3c-ccg.github.io/lds-ed25519-2020/).

## Install

```js
npm i
```

## Usage

```
npm test
```

##Generator

To generate new test data use this command:

```js
npm run generate-vcs
```


##Implementation

To add a new Implementation simply add a new file to the Implementations dir.
```js
{
  "name": "Your Company Name",
  "implementation": "Your Implementation Name",
  "issuer": {
    "id": "did:your-did-method:your-did-id",
    "endpoint": "https://your-company.com/vc-issuer/issue",
    "headers": {
      "authorization": "Bearer your auth token"
    }
  },
  "verifier": "https://your-company.com/vc-verifier/verify"
}
```

You will also need to whitelist the implementation in `tests/01-interop.js`.

```js
// test these implementations' issuers or verifiers
const test = [
  'Your Company Name'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));
```
