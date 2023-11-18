const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

async function main() {
  let addresses = ["0x0819BBae96c2C0F15477D212e063303221Cf24b9", "0x36116322dE660B313AD7CBfB6aEF6E5298Fc6Ab6"];

  // Hash addresses to get the leaves
  let leaves = addresses.map(addr => keccak256(addr));

  // Create tree
  let merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  // Get root
  let rootHash = merkleTree.getRoot().toString("hex");

  // Pretty-print tree
  console.log(merkleTree.toString());
  console.log(rootHash.toString());
}
main();
