const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {abi, address, MNEMONIC, INFURA_URL} = require('./config');

const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);

const web3 = new Web3(provider);

const imageContract = new web3.eth.Contract(abi, address)

module.exports.imageContract = imageContract;
module.exports.web3 = web3;

// const getImage = imageContract.methods.getImage().call()
// .then(function(result){
//     console.log(result)
// });

// imageContract.methods.addImage("id", "hash").send({from:"0x568015964fAEEfb12eD8f385d26aC7f7fA4357a5", gas: 150000}) 
//     .on('transactionHash', function(hash){
//     console.log(hash)
// })





