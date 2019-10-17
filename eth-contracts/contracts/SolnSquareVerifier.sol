pragma solidity >=0.4.21 <0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import "./ERC721Mintable.sol";

contract SquareVerifier {
    function verifyTx(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) public returns (bool r) {}
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Metadata {
    using SafeMath for uint256;

    SquareVerifier squareVerifier;

    uint256 tokenId;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        address owner;
        bool isSubmitted;
        bool isMinted;
    }

    // TODO define an array of the above struct
    Solution[] solutionArr;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address addr);

    modifier requireNotDuplicatedSolution(uint256 publicInput) {
        require(!solutions[publicInput].isSubmitted, "This solution is already submitted");
        _;
    }

    modifier requireVerified(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) {
        require(verify(a, a_p, b, b_p, c, c_p, h, k, input), "This soltion is not verified");
        _;
    }

    constructor(
        address _squareVerifierAddr,
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    )
        ERC721Metadata(name, symbol, baseTokenURI)
        public
    {
        squareVerifier = SquareVerifier(_squareVerifierAddr);
    }

    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    function verify(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) internal returns (bool) {
        return squareVerifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint[2] calldata a,
        uint[2] calldata a_p,
        uint[2][2] calldata b,
        uint[2] calldata b_p,
        uint[2] calldata c,
        uint[2] calldata c_p,
        uint[2] calldata h,
        uint[2] calldata k,
        uint[2] calldata input
    ) external requireNotDuplicatedSolution(input[0]) {
        bool ret = verify(a, a_p, b, b_p, c, c_p, h, k, input);
        require(ret, "This solution is not verified");
    
        Solution memory newSolution = Solution({
            owner: msg.sender,
            isSubmitted: true,
            isMinted: false
        });
        uint256 publicInput = input[0];
        solutions[publicInput] = newSolution;
        solutionArr.push(newSolution);

        emit SolutionAdded(publicInput, msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(uint256 publicInput) external onlyOwner {
        Solution memory solution = solutions[publicInput];
        require(solution.isSubmitted, "This solution is not submitted yet");
        require(!solution.isMinted, "This is already minted");

        address tokenOwner = solution.owner;
        tokenId = tokenId.add(1);
        super._mint(tokenOwner, tokenId);
        super.setTokenURI(tokenId);

        solution.isMinted = true;
    }

}
