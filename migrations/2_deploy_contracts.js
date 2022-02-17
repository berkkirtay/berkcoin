var BerkToken = artifacts.require("./BerkToken.sol");
var CollectibleToken = artifacts.require("./CollectibleToken.sol");

module.exports = function (deployer) {
  deployer.deploy(BerkToken);
  deployer.deploy(CollectibleToken);
};
