const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider('seven hope strike monitor unfold goddess tuition oxygen practice final start side','https://ropsten.infura.io/v3/77a5582834c44ad2bb794d0537a42486');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attemping to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['1','qweqweqwe1']})
        .send({gas: '1000000', from: accounts[0]});
    
    console.log(interface);
    console.log('Contract deploy to ', result.options.address);
}

deploy();

