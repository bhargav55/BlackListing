/*eslint prefer-const: "off"*/
import {
    Transfer as TransferEvent,
  } from "../generated/Token/Token";
  
  import {TokenWithMerkleTransfer } from "../generated/schema";
  
  export function handleTransfer(event: TransferEvent): void {
      let tokenTransfer = TokenWithMerkleTransfer.load(event.params.from.toHexString());
      if(tokenTransfer == null){
          tokenTransfer= new TokenWithMerkleTransfer(event.params.from.toHexString());
          tokenTransfer.userAddress = event.params.from;
          tokenTransfer.transferAddress = [event.params.from];
      }
      let users = tokenTransfer.transferAddress;
      if(!users.includes(event.params.to)) users.push(event.params.to);
      tokenTransfer.transferAddress = users;
      tokenTransfer.save();
  }