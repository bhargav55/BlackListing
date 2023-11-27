/*eslint prefer-const: "off"*/
import {
  Transfer as TransferEvent,
  BlackList as BlackListEvent,
  WhiteList as WhiteListEvent,
} from "../generated/TokenWithMerkle/TokenMerkle";

import { TokenTransfer, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // let tokenTransfer = TokenTransfer.load(event.params.from.toHexString());
  // if (tokenTransfer == null) {
  //   tokenTransfer = new TokenTransfer(event.params.from.toHexString());
  //   tokenTransfer.userAddress = event.params.from;
  //   tokenTransfer.transferAddress = [event.params.from];
  // }
  // let users = tokenTransfer.transferAddress;
  // if (!users.includes(event.params.to)) users.push(event.params.to);
  // tokenTransfer.transferAddress = users;
  // tokenTransfer.save();

  let fromUser = User.load(event.params.from.toHexString());
  if (fromUser == null) {
    fromUser = new User(event.params.from.toHexString());
    fromUser.userAddress = event.params.from;
    fromUser.transferAddress = [event.params.from];
    fromUser.isBlackListed = false;
  }
  let fromUsers = fromUser.transferAddress;
  if (!fromUsers.includes(event.params.to)) fromUsers.push(event.params.to);
  fromUser.transferAddress = fromUsers;
  fromUser.save();

  let toUser = User.load(event.params.to.toHexString());
  if (toUser == null) {
    toUser = new User(event.params.to.toHexString());
    toUser.userAddress = event.params.to;
    toUser.transferAddress = [event.params.to];
    toUser.isBlackListed = false;
  }
  let toUsers = toUser.transferAddress;
  if (!toUsers.includes(event.params.from)) toUsers.push(event.params.from);
  toUser.transferAddress = toUsers;
  toUser.save();
}
export function handleBlackList(event: BlackListEvent): void {
  let user = User.load(event.params._user.toHexString());
  if (user == null) {
    user = new User(event.params._user.toHexString());
    user.userAddress = event.params._user;
    user.transferAddress = [event.params._user];
  }
  user.isBlackListed = true;
  user.save();
  let transferAddress = user.transferAddress;
  for (let i = 0; i < transferAddress.length; i++) {
    let user = User.load(transferAddress[i].toHexString());
    if (user!.userAddress.toHexString() == "0x0000000000000000000000000000000000000000") continue;
    user!.isBlackListed = true;
    let nestedUsers = user!.transferAddress;
    for(let  j =0;j<nestedUsers.length;j++){
      let nestedUser = User.load(nestedUsers[j].toHexString());
      if (nestedUser!.userAddress.toHexString() == "0x0000000000000000000000000000000000000000") continue;
      nestedUser!.isBlackListed = true;
      nestedUser!.save();
    }
    user!.save();
  }
}
export function handleWhiteList(event: WhiteListEvent): void {
  let user = User.load(event.params._user.toHexString());
  if (user == null) {
    user = new User(event.params._user.toHexString());
    user.userAddress = event.params._user;
    user.transferAddress = [event.params._user];
  }
  user.isBlackListed = false;
  user.save();
  let transferAddress = user.transferAddress;
  for (let i = 0; i < transferAddress.length; i++) {
    let user = User.load(transferAddress[i].toHexString());
    if (user!.userAddress.toHexString() == "0x0000000000000000000000000000000000000000") continue;
    user!.isBlackListed = false;
    let nestedUsers = user!.transferAddress;
    for(let  j =0;j<nestedUsers.length;j++){
      let nestedUser = User.load(nestedUsers[j].toHexString());
      if (nestedUser!.userAddress.toHexString() == "0x0000000000000000000000000000000000000000") continue;
      nestedUser!.isBlackListed = false;
      nestedUser!.save();
    }
    user!.save();
  }
}
