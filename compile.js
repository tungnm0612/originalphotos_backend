const path = require('path');
const fs = require('fs');
const solc = require('solc');

const imagePath = path.resolve(__dirname, 'contracts', 'image.sol');
const source = fs.readFileSync(imagePath, 'utf8');
const compiledSource = solc.compile(source, 1).contracts[':ImageContract'];

module.exports = compiledSource;

// console.log(compiledSource);