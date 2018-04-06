# bucketh

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

## LICENSE

GPL-3.0
