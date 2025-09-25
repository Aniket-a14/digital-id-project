const { ethers } = require("ethers");

module.exports = {
  signData: (privateKey, data) => {
    const wallet = new ethers.Wallet(privateKey);
    const hash = ethers.hashMessage(typeof data === "string" ? data : JSON.stringify(data));
    return wallet.signMessage(hash);
  }
};
