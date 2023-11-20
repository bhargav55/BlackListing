/*eslint prefer-const: "off"*/
import { 
  Transfer as TransferEvent,
  BlackList as BlackListEvent,
  WhiteList as WhiteListEvent } from "../generated/TokenWithMerkle/TokenMerkle";

import { TokenTransfer , User} from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let tokenTransfer = TokenTransfer.load(event.params.from.toHexString());
  if (tokenTransfer == null) {
    tokenTransfer = new TokenTransfer(event.params.from.toHexString());
    tokenTransfer.userAddress = event.params.from;
    tokenTransfer.transferAddress = [event.params.from];
  }
  let users = tokenTransfer.transferAddress;
  if (!users.includes(event.params.to)) users.push(event.params.to);
  tokenTransfer.transferAddress = users;
  tokenTransfer.save();

  let user = User.load(event.params.from.toHexString());
  if (user == null) {
    user = new User(event.params.from.toHexString());
    user.userAddress = event.params.from;
    user.transferAddress = [event.params.from];
    user.isBlackListed = false;
  }
  let users1 = user.transferAddress;
  if (!users1.includes(event.params.to)) users1.push(event.params.to);
  user.transferAddress = users1;
  user.save();
}
export function handleBlackList(event: BlackListEvent): void {
  let user = User.load(event.params._user.toHexString())
  if(user == null){
    user = new User(event.params._user.toHexString())
    user.userAddress = event.params._user;
    user.transferAddress =[event.params._user];
  }
  user.isBlackListed = true;
  user.save();
  let transferAddress = user.transferAddress;
  for(let i =0;i<transferAddress.length;i++){
    let user = User.load(transferAddress[i].toHexString());
      user!.isBlackListed=true;
      user!.save();
  }
}
export function handleWhiteList(event: WhiteListEvent): void {
  let user = User.load(event.params._user.toHexString())
  if(user == null){
    user = new User(event.params._user.toHexString())
    user.userAddress = event.params._user;
    user.transferAddress =[event.params._user];
  }
  user.isBlackListed = false;
  user.save();
  let transferAddress = user.transferAddress;
  for(let i =0;i<transferAddress.length;i++){
    let user = User.load(transferAddress[i].toHexString());
      user!.isBlackListed=false;
      user!.save();
  }
}
