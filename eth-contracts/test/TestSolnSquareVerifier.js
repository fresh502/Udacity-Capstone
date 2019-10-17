const fs = require('fs');
const path = require('path');

const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const [contractOwner, accountOne] = accounts;

    const name = 'Udacity';
    const symbol = 'UDC';
    const baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    const { proof: { a, a_p, b, b_p, c, c_p, h, k }, inputs } = JSON.parse(fs.readFileSync(path.join(__dirname, '../../zokrates/code/square/proof.json')));

    let verifierContract, erc721Contract;
    describe('SolnSquareVerifier spec', function() {
        before(async function() {
            verifierContract = await SquareVerifier.new();
            erc721Contract = await SolnSquareVerifier.new(verifierContract.address, name, symbol, baseTokenURI);
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('new solution can be added', async function () {
            const { logs: [{ event }] } = await erc721Contract.addSolution(a, a_p, b, b_p, c, c_p, h, k, inputs, { from: accountOne })                         
            
            assert.equal(event, 'SolutionAdded', 'Correct solution should be added');
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('new ERC721 token can minted', async function() {
            const publicInput = inputs[0];
            const { logs: [{ event }] } = await erc721Contract.mint(publicInput, { from: contractOwner });

            assert.equal(event, 'Transfer', 'new ERC721 token should be minted');
        })
    })
})
