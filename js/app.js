App = {
    web3Provider: null,
    contracts: {},
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    contractAddr: "0xCc5E7340089Ed559589190Db9b8cC34BE053E22E",

    init: async function () {
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        App.getMetaskAccountID();

        return App.initSol();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];
        })
    },

    initSol: function () {
        /// Source the truffle compiled smart contracts
        var jsonSol='../eth-contracts/build/contracts/SolnSquareVerifier.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSol, function(data) {
            var web3 = new Web3(App.web3Provider);
            App.contracts.Sol = new web3.eth.Contract(data.abi, App.contractAddr);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $('#add-solution').on('click', App.addSolution);
        $('#mint').on('click', App.mint);
    },

    addSolution: function (event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var jsonProof = '../zokrates/code/square/proof.json'
        var a, a_p, b, b_p, c, c_p, h, k, inputs;
        $.getJSON(jsonProof, function(data) {
            ({ proof: { a, a_p, b, b_p, c, c_p, h, k}, inputs } = data);
            App.contracts.Sol.methods.addSolution(a, a_p, b, b_p, c, c_p, h, k, inputs).send({ from: App.metamaskAccountID })
            .on('error', console.error);
        })
    },

    mint: function (event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var jsonProof = '../zokrates/code/square/proof.json'
        var publicInput;
        $.getJSON(jsonProof, function(data) {
            ({ inputs: [publicInput] } = data);
            App.contracts.Sol.methods.mint(publicInput).send({ from: App.metamaskAccountID })
            .on('error', console.error);
        })
    }
}

    $(function () {
        $(window).load(function () {
            App.init();
        });
    });
