import Web3 from "web3";
import { Token } from "./contractAddress";
import TokenJson from "./abi/Token.json";
import { request, gql } from "graphql-request";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export const PurchaseToken = async (user, amount, payInEth) => {
    const web3 = window.web3;
    payInEth = web3.utils.toWei(payInEth, "ether");
    amount = web3.utils.toWei(amount, "ether");

    const token = new web3.eth.Contract(TokenJson, Token);
    return token.methods.purchase(amount).send({ from: user, value: payInEth });
};

export const BlackListUser = async (user, blackListAccount) => {
    const web3 = window.web3;

    const token = new web3.eth.Contract(TokenJson, Token);

    return token.methods.addBlackList(blackListAccount).send({ from: user });
};

export const WhiteListUser = async (user, whiteListAccount) => {
    const web3 = window.web3;

    const token = new web3.eth.Contract(TokenJson, Token);

    return token.methods.removeBlackList(whiteListAccount).send({ from: user });
};
export const updateBlackListUser = async (user, users, isBlackListed) => {
    const web3 = window.web3;

    const token = new web3.eth.Contract(TokenJson, Token);
    console.log("updateBlackListUser:", users);

    return token.methods
        .updateBlackList(users, isBlackListed)
        .send({ from: user });
};

export const GetBlackListedUsers = async () => {
    const endpoint =
        "https://api.thegraph.com/subgraphs/name/bhargav55/whitelisting";

    const query = `{
          users(where:{isBlackListed:true}){
            userAddress
          }
        }`;
    const data = await request(endpoint, query);

    let users = [];
    if (data.users.length > 0) {
        data.users.map(user => {
            users.push(user.userAddress);
        });
    }
    return users;
};

export const getTokenPrice = async () => {
    const web3 = window.web3;
    try {
        const token = new web3.eth.Contract(TokenJson, Token);

        let cost = await token.methods.cost().call();
        return Number(cost);
    } catch (ex) {
        return 0;
    }
};

// export const getRootHash= async (users) =>{
//     const tree =  StandardMerkleTree.of(users, ["address"])
//     let rootHash = tree.root;
//     console.log("rootHash:",rootHash)

//     // Pretty-print tree
//     console.log(tree.toString());
//     console.log(rootHash.toString());
//     return rootHash;
// }

// export const transfer = async(from, to, amount) => {
//     const tree =  StandardMerkleTree.of(users, ["address"])
//     let rootHash = tree.root;
//     console.log("rootHash:",rootHash)

//   const fromProof = tree.getProof(from);
//   const toProof = tree.getProof(to);

//   const web3 = window.web3
//   const token = new web3.eth.Contract(
//     TokenJson,
//     Token
//     );
//     await token.methods.transferWithMerkle(to, amount, fromProof,toProof).send({from:from})
// }
