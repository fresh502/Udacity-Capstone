# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

## Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)

## How to run

```shell
ganache-cli
```

 open new terminal

```shell
docker run -v <path to your project folder>/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
cd code/square/
~/zokrates compile -i square.code
~/zokrates setup --proving-scheme pghr13
~/zokrates compute-witness -a <a> <b>
~/zokrates generate-proof --proving-scheme pghr13
~/zokrates export-verifier --proving-scheme pghr13
```

open new terminal and on your project folder

```shell
cp zokrates/code/square/verifier.sol eth-contracts/contracts/
npm i
cd eth-contracts/
truffle test
truffle migrate
cd ..
npm run dev
```

On browser you can add solution and mint.
You have to run compute-witness, generate-proof before each add solution and mint






