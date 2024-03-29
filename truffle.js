module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
        host: "localhost",
        port: 7545,
        network_id: "*"
        //network_id: "10"
    },
  },
  compilers: {
    solc: {
      version: "0.4.24", // A version or constraint - Ex. "^0.5.0"
                         // Can also be set to "native" to use a native solc
      // docker: <boolean>, // Use a version obtained through docker
      // settings: {
      //   optimizer: {
      //     enabled: <boolean>,
      //     runs: <number>   // Optimize for how many times you intend to run the code
      //   }
      //   evmVersion: <string> // Default: "byzantium"
      // }
    }
  }
};
