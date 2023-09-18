import NodeRSA = require("node-rsa");
import { Address, Hex } from "../types/common";
import { append0x } from "./hex";
import { getJoyIDLockScript } from "../constants";
import { blake160, hexToBytes, scriptToAddress } from "@nervosnetwork/ckb-sdk-utils";
import { read } from "fs";

export const pemToKey = (privatePem: string): NodeRSA => {
    const key = new NodeRSA();
    key.setOptions({signingScheme: 'pkcs1-sha256'});
    return key
}

export const exportPubkey = (key: NodeRSA): string => {
    const pubkey: NodeRSA.KeyComponentsPublic = key.exportKey('components-public')

    if (typeof pubkey.e != 'number') {
        throw new Error('Invalid public key')
    }
    
    const pubkeyE: number = pubkey.e
    const e = pubkeyE.toString(16).padStart(8, '0')
    const n = pubkey.n.slice(1)

    const eBuffer = Buffer.from(e, 'hex').reverse()
    const nBuffer = n.reverse()

    const pubKey = Buffer.concat([eBuffer, nBuffer])
    return pubKey.toString('hex')
}

export const addressFromPemKey = (privateKeyPem: string, isMainnet: boolean = false): Address => {
    const pubkey = append0x(exportPubkey(pemToKey(privateKeyPem)))
    const lock = {
        ...getJoyIDLockScript(isMainnet),
        args: `0x0003${blake160(hexToBytes(pubkey), 'hex')}`
    }

    return scriptToAddress(lock, isMainnet)
}

export const signRSAMessage = (key: NodeRSA, message: Hex) => {
    if (!message.startsWith('0x')) {
        throw new Error('Invalid message')
    }

    const signature = key.sign(Buffer.from(message.replace('0x', ''), 'hex'), 'hex')

    verifyRSASignature(key, message, signature)

    return signature
}

export const verifyRSASignature = (key: NodeRSA, message: Hex, signature: Hex) => {
    if (!message.startsWith('0x')) {
        throw new Error('Invalid message')
    }

    const result = key.verify(Buffer.from(message.replace('0x', ''), 'hex'), Buffer.from(signature.replace('0x', ''), 'hex'))

    console.log('verify result', result)
    return result
}
