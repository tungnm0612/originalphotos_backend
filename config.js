
const abi = [{"constant":false,"inputs":[{"name":"_idUser","type":"string"},{"name":"_hashImage","type":"string"}],"name":"addImage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"Images","outputs":[{"name":"_idUser","type":"string"},{"name":"_hashImage","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ImagesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getImage","outputs":[{"components":[{"name":"_idUser","type":"string"},{"name":"_hashImage","type":"string"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"}]
const address = "0x036e58404E30795b3E5C945bc2A4107737F119cA"

const MNEMONIC = "seven hope strike monitor unfold goddess tuition oxygen practice final start side"
const INFURA_URL = "https://ropsten.infura.io/v3/77a5582834c44ad2bb794d0537a42486"

module.exports.abi  = abi;
module.exports.address = address;
module.exports.MNEMONIC = MNEMONIC;
module.exports.INFURA_URL = INFURA_URL;