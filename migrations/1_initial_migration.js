var Migrations = artifacts.require("./Migrations.sol");
var Bucket = artifacts.require("./Bucket.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Bucket);
};
