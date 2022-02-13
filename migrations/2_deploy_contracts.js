var BerkToken = artifacts.require("./BerkToken.sol");

module.exports = function (deployer) {
  deployer.deploy(BerkToken);
};
