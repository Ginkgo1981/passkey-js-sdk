import { Byte, Byte2, Byte32, Byte4, Bytes, Hex } from "./common";

export interface BaseReq {}

export interface BaseResp {}

export interface ExtSubKey {
    extData: Byte4,
    algIndex: Byte2,
    pubkeyHash: Hex
}

export interface ExtSubExtSubkeyReq extends BaseReq {
    lockScript: Bytes,
    extAction: Byte,
    subkeys: ExtSubKey[]
}

export interface ExtSubkeyResp extends BaseResp {
    smtRootHash: Byte32
    extensionSmtEntry: Bytes
    blockNumber: bigint
}

