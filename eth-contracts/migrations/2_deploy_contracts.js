// migrating the appropriate contracts
const SquareVerifier = artifacts.require("SquareVerifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = (deployer) => {
  deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier, SquareVerifier.address,'Udacity', 'UDC', 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'); 
};
