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

## Generator

To generate new test data you need a seed for a key to sign
the credentials with.

You must set this environment variable:

```
CLIENT_SECRET_DB=zMultibaseMultiencoded
```

Then use this command:

```js
npm run generate-credentials
```


## Implementation
To add your implementation to this test suite see the [README here.](https://github.com/w3c-ccg/vc-api-test-suite-implementations)
Add the tag `Ed25519Signature2020` to the issuers and verifiers you want tested.
