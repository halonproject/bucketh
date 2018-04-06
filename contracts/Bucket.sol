pragma solidity ^0.4.18;

import "./Ownable.sol";

contract Bucket is Ownable {
    address public owner;
    string[] private fileNames;
    mapping (string => string) private fileHashes;
    mapping (string => bool) private fileExists;

    event FileAdded(string _filename, string _ipfsHash);
    event FileRemoved(string _filename, string ipfsHash);
    event FileHashUpdated(string _filename, string _newIPFSHash);

    function Bucket() public {
        owner = msg.sender;
    }

    function addFile(string _filename, string _ipfsHash) public onlyOwner returns (bool) {
        bytes memory _filenameBytes = bytes(_filename);
        bytes memory _hashBytes = bytes(_filename);
        if (_fileExists(_filename) || _filenameBytes.length == 0 || _hashBytes.length == 0) {
            return false;
        }

        fileNames.push(_filename);
        fileHashes[_filename] = _ipfsHash;
        fileExists[_filename] = true;
        emit FileAdded(_filename, _ipfsHash);
        return true;
    }

    function removeFile(string _filename) public onlyOwner returns (bool) {
        if (!_fileExists(_filename)) {
            return false;
        }

        for (uint i = 0; i < fileNames.length; i++) {
            string memory filename = fileNames[i];
            if (keccak256(filename) == keccak256(_filename)) {
                fileNames[i] = fileNames[fileNames.length - 1];
                delete fileNames[fileNames.length - 1];
                fileNames.length--;
                break;
            }
        }

        string storage fileHash = fileHashes[_filename];
        fileHashes[_filename] = "";
        fileExists[fileHash] = false;
        emit FileRemoved(_filename, fileHash);
        return true;
    }

    function ipfsHash(string _filename) public view onlyOwner returns (string) { return fileHashes[_filename]; }

    function setIPFSHash(string _filename, string _ipfsHash) public onlyOwner returns (bool) {
        bytes memory _hashBytes = bytes(_ipfsHash);
        if (!_fileExists(_filename) || _hashBytes.length == 0) {
            return false;
        }

        fileHashes[_filename] = _ipfsHash;
        emit FileHashUpdated(_filename, _ipfsHash);
        return true;
    }

    function totalFiles() public view returns (uint256) { return fileNames.length; }

    function _fileExists(string _filename) internal view returns (bool) {
        return fileExists[_filename];
    }
}
