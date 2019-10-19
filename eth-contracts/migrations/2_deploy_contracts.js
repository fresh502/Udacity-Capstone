const fs = require('fs');

const SquareVerifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = (deployer) => {
  deployer.deploy(SquareVerifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address,'Udacity', 'UDC', 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'); 
  }).then(() => {
    console.log(SolnSquareVerifier.address);
    fs.writeFileSync('../contractAddress.json', JSON.stringify({ address: SolnSquareVerifier.address }));
  })
};
