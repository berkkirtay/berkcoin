var Token = artifacts.require("./Token.sol");
var Staking = artifacts.require("./CryptoStaking.sol");

module.exports = function (deployer) {
  deployer.deploy(Token);
  deployer.deploy(Staking)
};
