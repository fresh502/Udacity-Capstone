const ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const [contractOwner, accountOne, accountTwo]  = accounts;

    const name = 'Udacity';
    const symbol = 'UDC';
    const baseTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    // TODO 매번 new를 하면 계속 컨트랙트를 배포하는 것이기 때문에 비효율적이지 않을까? 클라이언트 로그를 통해 확인해보고 deployed() 활용방안 모색
    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, baseTokenURI);

            // TODO: mint multiple tokens
            await this.contract.mint(accountOne, 1);
            await this.contract.mint(accountOne, 2);
            await this.contract.mint(accountTwo, 3);
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply();            
            
            assert.equal(totalSupply, 3, 'Total supply is not correct');
        })

        it('should get token balance', async function () { 
            const balance_one = await this.contract.balanceOf(accountOne);  
            const balance_two = await this.contract.balanceOf(accountTwo);  

            assert.equal(balance_one, 2, 'Account one\'s Balance is not correct');
            assert.equal(balance_two, 1, 'Account two\'s Balance is not correct');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI(1);
            
            assert.equal(tokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', 'Token URI is incorrect');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(accountOne, accountTwo, 1, { from: accountOne });
            const newOwner = await this.contract.ownerOf(1);

            assert.equal(newOwner, accountTwo, 'Transferring token is not implemented');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, baseTokenURI, { from: contractOwner });
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let isError = false;
            try {
                await this.contract.mint(accountOne, 4, { from: accountOne });
            } catch (e) {
                if (e.message.includes('Only owner call')) isError = true;
            }

            assert.equal(isError, true, 'Only contract owner can mint');
        })

        it('should return contract owner', async function () { 
            const currentContractOwner = await this.contract.owner();            

            assert.equal(currentContractOwner, contractOwner, 'Incorrect contract owner');
        })

    });
})