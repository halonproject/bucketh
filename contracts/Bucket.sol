pragma solidity ^0.4.21;

import "./Ownable.sol";

contract Bucket is Ownable {
    address public owner;
    uint public lastFileId = 0;
    mapping (uint => File) private files;

    event FileRename(address indexed entity, uint fileId);
    event FileContentUpdate(address indexed entity, uint fileId);
    event NewFile(address indexed entity, uint fileId);
    event NewWritePermission(address indexed entity, uint fileId);
    event NewReadPermission(address indexed entity, uint fileId);
    event DeleteFile(address indexed entity, uint fileId);

    struct File {
        string storageRef;
        string name;
        uint fileSize;
        bool isPublic;
        bool isDeleted;
        address fileOwner;
        uint lastModified;
        mapping (address => Permission) permissions;
        address[] permissionAddresses;
    }

    struct Permission {
        bool read;
        bool write;
        bool exists;
    }

    constructor() public {
        owner = msg.sender;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    function addFile(string _storageRef, string _name, uint _fileSize, bool _isPublic) public onlyOwner returns (uint) {
        lastFileId = lastFileId + 1;

        files[lastFileId] = File({
            storageRef: _storageRef,
            name: _name,
            fileSize: _fileSize,
            isPublic: _isPublic,
            isDeleted: false,
            fileOwner: owner,
            lastModified: now,
            permissionAddresses: new address[](0)
        });
        emit NewFile(owner, lastFileId);
        return lastFileId;
    }

    function getFile(uint _fileId)
        public
        view
        returns (
            string storageRef,
            string name,
            uint fileSize,
            bool isPublic,
            bool isDeleted,
            address fileOwner,
            bool isOwner,
            uint lastModified,
            address[] permissionAddresses,
            bool writeAccess
        )
    {
        File storage file = files[_fileId];

        storageRef = file.storageRef;
        name = file.name;
        fileSize = file.fileSize;
        isPublic = file.isPublic;
        isDeleted = file.isDeleted;
        fileOwner = file.fileOwner;
        isOwner = msg.sender == owner;
        lastModified = file.lastModified;
        permissionAddresses = file.permissionAddresses;
        writeAccess = hasWriteAccess(_fileId, msg.sender);
    }

    function removeFile(uint _fileId) public onlyOwner {
        files[_fileId].isDeleted = true;
        files[_fileId].lastModified = now;
        emit DeleteFile(owner, lastFileId);
    }

    function setFileName(uint _fileId, string _newName) public {
        require(hasWriteAccess(_fileId, msg.sender), "sender not authorized");

        files[_fileId].name = _newName;
        files[_fileId].lastModified = now;
        emit FileRename(msg.sender, lastFileId);
    }

    function setFileContent(uint _fileId, string _storageRef, uint _fileSize) public {
        require(hasWriteAccess(_fileId, msg.sender), "sender not authorized");

        files[_fileId].storageRef = _storageRef;
        files[_fileId].fileSize = _fileSize;
        files[_fileId].lastModified = now;
        emit FileRename(msg.sender, lastFileId);
    }

    function getPermissionAddresses(uint _fileId) public view returns (address[] addresses) {
        return files[_fileId].permissionAddresses;
    }

    function getPermission(uint _fileId, address _entity) public view returns (bool write, bool read) {
        Permission storage permission = files[_fileId].permissions[_entity];

        write = permission.write;
        read = permission.read;
    }

    function setWritePermission(uint _fileId, address _entity, bool _permission) public onlyOwner {
        if (!files[_fileId].permissions[_entity].exists) {
            files[_fileId].permissionAddresses.push(_entity);
            files[_fileId].permissions[_entity].exists = true;
        }

        files[_fileId].permissions[_entity].write = _permission;
        emit NewWritePermission(msg.sender, lastFileId);
    }

    function setReadPermission(uint _fileId, address _entity, bool _permission) public onlyOwner {
        if (!files[_fileId].permissions[_entity].exists) {
            files[_fileId].permissionAddresses.push(_entity);
            files[_fileId].permissions[_entity].exists = true;
        }

        files[_fileId].permissions[_entity].read = _permission;
        emit NewWritePermission(msg.sender, lastFileId);
    }

    function hasWriteAccess(uint _fileId, address _entity) public view returns (bool){
        return isOwner(_entity) || files[_fileId].permissions[_entity].write;
    }

    function hasReadAccess(uint _fileId, address _entity) public view returns (bool){
        return isOwner(_entity) || files[_fileId].permissions[_entity].read;
    }

    function isOwner(address _entity) internal view returns (bool) {
        return _entity == owner;
    }
}
