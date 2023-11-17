import { Signer } from "@ethersproject/abstract-signer";

export interface Accounts {
  admin: string;
  admin1: string;
  admin2: string;
  admin3: string;
  admin4: string;
}

export interface Signers {
  admin: Signer;
  admin1: Signer;
  admin2: Signer;
  admin3: Signer;
  admin4: Signer
}
