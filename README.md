# bucketh

[![CircleCI](https://circleci.com/gh/halonproject/bucketh/tree/master.svg?style=svg)](https://circleci.com/gh/halonproject/bucketh/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/halonproject/bucketh/badge.svg?branch=master)](https://coveralls.io/github/halonproject/bucketh?branch=master)

Solidity contracts that holds the files and IPFS hashes that belong to a "bucket".
These provide a type of registry for which files are register to which bucket. The
contracts are to be used by applications which can add files to IPFS and register
those to a bucket.

## Motivation

This project provides the contracts needed for applications to keep track of which
files are stored in a storage bucket in a decentralized fashion. This lays the
foundation for Pithos which is an set of applications that will use these contracts
in conjunction with IPFS to have ease of accessing files that are "stored" in a
bucket.

## Testing

To run the tests, run the following from the project:

```
$ npm install
$ npm run test
```

## Test instances

Rinkeby: 0xed2f9a10733701ada272af12f936f1f0592d9531

## LICENSE

GPL-3.0
