var Token = artifacts.require("./Token.sol");
var TokenWithStaking = artifacts.require("./TokenWithStaking.sol");

module.exports = function (deployer) {
  deployer.deploy(Token);
  deployer.deploy(TokenWithStaking);
};
