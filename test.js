import { create } from 'ipfs-http-client';
const ipfs = create({
  host: '10.27.66.132',
  port: 5001,
  protocol: 'http', // use http for local node
});

async function test() {
const word = "hello world";

const added = await ipfs.add(word);

console.log("ipfs hash", added.path);
}

test();