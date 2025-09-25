const { create } = require("ipfs-http-client");
require("dotenv").config();

let client;
if (process.env.IPFS_PROJECT_ID && process.env.IPFS_PROJECT_SECRET) {
  const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET).toString('base64');
  client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: { authorization: auth }
  });
} else {
  client = create(); // uses default public gateway
}

module.exports = {
  uploadJSON: async (obj) => {
    const { cid } = await client.add(JSON.stringify(obj));
    return cid.toString();
  },
  uploadFile: async (buffer) => {
    const { cid } = await client.add(buffer);
    return cid.toString();
  }
};
