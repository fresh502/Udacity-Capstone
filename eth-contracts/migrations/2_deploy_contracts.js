// migrating the appropriate contracts
const ERC721 = artifacts.require("CustomERC721Token");
const SquareVerifier = artifacts.require("SquareVerifier");
// const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = function(deployer) {
  deployer.deploy(ERC721, 'name', 'symbol', 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'); 
  deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
};
