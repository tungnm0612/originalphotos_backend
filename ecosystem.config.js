module.exports = {
    apps: [{
        name: "Original Photos",
        script: "./app.js",
        env_ropsten: {
            NODE_ENV: "development"
        },
        env_mainnet: {
            NODE_ENV: "production"
        }
    }]
}